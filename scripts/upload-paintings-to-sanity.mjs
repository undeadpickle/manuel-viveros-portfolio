import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

// Sanity client configuration
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

const IMAGES_DIR = path.join(__dirname, '../public/images/paintings/optimized')

// Extract painting number from filename (e.g., "painting_01.jpg" -> 1)
function extractNumber(filename) {
  const match = filename.match(/painting_(\d+)\.jpg/i)
  return match ? parseInt(match[1], 10) : 0
}

// Format number with leading zero (e.g., 1 -> "01")
function formatNumber(num) {
  return num.toString().padStart(2, '0')
}

async function uploadPainting(imagePath, number) {
  const filename = path.basename(imagePath)
  const formattedNum = formatNumber(number)

  console.log(`\n[${number}/52] Uploading ${filename}...`)

  try {
    // 1. Upload the image asset to Sanity
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: 'image/jpeg',
    })

    console.log(`  ✓ Asset uploaded: ${asset._id}`)

    // 2. Create the artwork document
    const doc = {
      _type: 'artwork',
      title: {
        en: `Painting ${formattedNum}`,
        es: `Pintura ${formattedNum}`,
      },
      slug: {
        _type: 'slug',
        current: `painting-${formattedNum}`,
      },
      category: 'painting',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      medium: {
        en: 'Oil on canvas',
        es: 'Óleo sobre lienzo',
      },
      featured: false,
      order: number,
    }

    const createdDoc = await client.create(doc)
    console.log(`  ✓ Document created: ${createdDoc._id}`)

    return { success: true, docId: createdDoc._id, assetId: asset._id }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Sanity Bulk Upload: Paintings')
  console.log('═'.repeat(60))
  console.log(`\nProject: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  console.log(`Source:  ${IMAGES_DIR}`)

  // Verify token exists
  if (!env.SANITY_API_TOKEN) {
    console.error('\n✗ Error: SANITY_API_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Get all optimized images, sorted by number
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => extractNumber(a) - extractNumber(b))

  console.log(`\nFound ${files.length} images to upload`)
  console.log('─'.repeat(60))

  let successCount = 0
  let failCount = 0
  const results = []

  for (const file of files) {
    const imagePath = path.join(IMAGES_DIR, file)
    const number = extractNumber(file)

    const result = await uploadPainting(imagePath, number)
    results.push({ file, ...result })

    if (result.success) {
      successCount++
    } else {
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Upload Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Successful: ${successCount}`)
  console.log(`  ✗ Failed:     ${failCount}`)
  console.log(`  Total:        ${files.length}`)

  if (failCount > 0) {
    console.log('\nFailed uploads:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.file}: ${r.error}`)
    })
  }

  console.log('\n✓ Done! Check your Sanity Studio at /studio')
}

main().catch(console.error)
