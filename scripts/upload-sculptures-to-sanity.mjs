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

const IMAGES_DIR = path.join(__dirname, '../public/images/sculptures/optimized')
const DATA_FILE = path.join(__dirname, '../data/sculptures-wix-data.json')

// Load metadata
const sculptureData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))

async function uploadSculpture(sculpture) {
  const paddedOrder = sculpture.order.toString().padStart(2, '0')
  const filename = `sculpture_${paddedOrder}.jpg`
  const imagePath = path.join(IMAGES_DIR, filename)

  console.log(`\n[${paddedOrder}/${sculptureData.totalCount}] Uploading "${sculpture.title.en}"...`)

  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`  ✗ Image not found: ${filename}`)
      return { success: false, error: 'Image not found' }
    }

    // 1. Upload the image asset to Sanity
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: 'image/jpeg',
    })

    console.log(`  ✓ Asset uploaded: ${asset._id}`)

    // Generate slug from title
    const slug = sculpture.title.en
      .toLowerCase()
      .replace(/[""()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      || `sculpture-${paddedOrder}`

    // 2. Create the artwork document
    const doc = {
      _type: 'artwork',
      title: sculpture.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      category: 'sculpture',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      medium: sculpture.medium,
      featured: false,
      order: sculpture.order,
    }

    // Add optional fields
    if (sculpture.dimensions) {
      doc.dimensions = sculpture.dimensions
    }
    if (sculpture.year) {
      doc.year = sculpture.year
    }

    const createdDoc = await client.create(doc)
    console.log(`  ✓ Document created: ${createdDoc._id}`)

    return {
      success: true,
      docId: createdDoc._id,
      assetId: asset._id,
      sanityImageUrl: `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${asset._id.replace('image-', '').replace('-jpg', '.jpg').replace('-jpeg', '.jpg')}`
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Sanity Bulk Upload: Sculptures')
  console.log('═'.repeat(60))
  console.log(`\nProject: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  console.log(`Source:  ${IMAGES_DIR}`)
  console.log(`Total:   ${sculptureData.totalCount} sculptures`)

  // Verify token exists
  if (!env.SANITY_API_TOKEN) {
    console.error('\n✗ Error: SANITY_API_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Verify images exist
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.jpg'))
  console.log(`Found:   ${files.length} optimized images`)
  console.log('─'.repeat(60))

  let successCount = 0
  let failCount = 0
  const results = []

  for (const sculpture of sculptureData.sculptures) {
    const result = await uploadSculpture(sculpture)

    // Update sculpture data with Sanity IDs
    if (result.success) {
      sculpture.sanityId = result.docId
      sculpture.sanityImageUrl = result.sanityImageUrl
      successCount++
    } else {
      failCount++
    }

    results.push({ ...sculpture, uploadResult: result })

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Save updated metadata with Sanity IDs
  const outputPath = path.join(__dirname, '../data/sculptures-metadata.json')
  fs.writeFileSync(outputPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/sculpture',
    totalCount: sculptureData.totalCount,
    withMetadata: sculptureData.withMetadata,
    successfulUploads: successCount,
    sculptures: sculptureData.sculptures
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Upload Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Successful: ${successCount}`)
  console.log(`  ✗ Failed:     ${failCount}`)
  console.log(`  Total:        ${sculptureData.totalCount}`)

  if (failCount > 0) {
    console.log('\nFailed uploads:')
    results.filter(r => !r.uploadResult.success).forEach(r => {
      console.log(`  - sculpture_${r.order.toString().padStart(2, '0')}: ${r.uploadResult.error}`)
    })
  }

  console.log(`\n  JSON saved: ${outputPath}`)
  console.log('\n✓ Done! Check your Sanity Studio at /studio')
}

main().catch(console.error)
