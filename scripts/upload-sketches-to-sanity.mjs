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

// Configuration - paths as constants at top of file
const IMAGES_DIR = path.join(__dirname, '../public/images/sketches/optimized')
const DATA_FILE = path.join(__dirname, '../data/sketches-wix-data.json')
const OUTPUT_FILE = path.join(__dirname, '../data/sketches-metadata.json')

// CLI arguments for batch processing
const args = process.argv.slice(2)
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : null
}
const LIMIT = getArg('limit')   // e.g., --limit 25
const OFFSET = getArg('offset') || 0  // e.g., --offset 25

// Load metadata
let sketchData
try {
  sketchData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
} catch (error) {
  console.error(`Error loading data file: ${DATA_FILE}`)
  console.error('Run extract-and-download-sketches.mjs first.')
  process.exit(1)
}

async function uploadSketch(sketch) {
  const paddedOrder = sketch.order.toString().padStart(3, '0')
  const filename = `sketch_${paddedOrder}.jpg`
  const imagePath = path.join(IMAGES_DIR, filename)

  console.log(`\n[${paddedOrder}] Uploading "${sketch.title.en}"...`)

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

    // Generate slug from order
    const slug = `sketch-${paddedOrder}`

    // 2. Create the artwork document
    const doc = {
      _type: 'artwork',
      title: sketch.title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      category: 'sketch',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      medium: sketch.medium,
      featured: false,
      order: sketch.order,
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
  console.log('  Sanity Bulk Upload: Sketches')
  console.log('═'.repeat(60))
  console.log(`\nProject: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  console.log(`Source:  ${IMAGES_DIR}`)
  console.log(`Total:   ${sketchData.totalCount} sketches in data file`)

  // Verify token exists
  if (!env.SANITY_API_TOKEN) {
    console.error('\n✗ Error: SANITY_API_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Verify images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`\n✗ Error: Images directory not found: ${IMAGES_DIR}`)
    console.error('Run optimize-sketches.mjs first.')
    process.exit(1)
  }

  // Get list of available optimized images
  const availableImages = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.jpg'))
  console.log(`Found:   ${availableImages.length} optimized images`)

  // Filter sketches to only those with available images
  let sketchesToUpload = sketchData.sketches.filter(s => {
    const paddedOrder = s.order.toString().padStart(3, '0')
    const filename = `sketch_${paddedOrder}.jpg`
    return availableImages.includes(filename)
  })

  // Apply offset and limit for batch processing
  const totalAvailable = sketchesToUpload.length
  sketchesToUpload = sketchesToUpload.slice(OFFSET, LIMIT ? OFFSET + LIMIT : undefined)

  if (LIMIT || OFFSET) {
    console.log(`Batch:   Processing ${sketchesToUpload.length} sketches (offset: ${OFFSET}, limit: ${LIMIT || 'none'})`)
  }
  console.log('─'.repeat(60))

  if (sketchesToUpload.length === 0) {
    console.log('\nNo sketches to upload. Make sure images are optimized.')
    return
  }

  let successCount = 0
  let failCount = 0
  const results = []

  for (const sketch of sketchesToUpload) {
    const result = await uploadSketch(sketch)

    // Update sketch data with Sanity IDs
    if (result.success) {
      sketch.sanityId = result.docId
      sketch.sanityImageUrl = result.sanityImageUrl
      successCount++
    } else {
      failCount++
    }

    results.push({ ...sketch, uploadResult: result })

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Save updated metadata with Sanity IDs
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/sketches',
    totalCount: sketchData.totalCount,
    successfulUploads: successCount,
    lastBatch: {
      offset: OFFSET,
      limit: LIMIT,
      processed: sketchesToUpload.length
    },
    sketches: sketchData.sketches
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Upload Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Successful: ${successCount}`)
  console.log(`  ✗ Failed:     ${failCount}`)
  console.log(`  Total:        ${sketchesToUpload.length}`)

  if (failCount > 0) {
    console.log('\nFailed uploads:')
    results.filter(r => !r.uploadResult.success).forEach(r => {
      console.log(`  - sketch_${r.order.toString().padStart(3, '0')}: ${r.uploadResult.error}`)
    })
  }

  console.log(`\n  JSON saved: ${OUTPUT_FILE}`)
  console.log('\n✓ Done! Check your Sanity Studio at /studio/structure/sketchesBocetos')
}

main().catch(console.error)
