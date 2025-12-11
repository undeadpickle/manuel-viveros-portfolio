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

// Wix data extracted from the website (sorted by orderIndex ascending = display order)
const wixPaintings = [
  {
    itemId: "acd6e5fd-18b1-4aeb-b4e4-43b4d5863158",
    title: "Paso Robles 2024",
    description: "16x20 in  oil on canvas  ( private collection ) ",
    orderIndex: -1693252143.935
  },
  {
    itemId: "99816889-10a8-4d23-8525-cbee36c639d8",
    title: "Vasona lake",
    description: "16x20in.  Oil on canvas  2023  private collection ",
    orderIndex: -1693252133.935
  },
  {
    itemId: "3660355f-6174-4c24-a060-f78ecf8c3afb",
    title: "El arbolito",
    description: "16 x20 oil on canvas 2023  private collection ",
    orderIndex: -1693252123.934
  },
  {
    itemId: "56618a8b-545d-4812-ae73-7853dc39f871",
    title: "At Vasona",
    description: "18x24 in . Oil on canvas  ,(2022)private collection ",
    orderIndex: -1685759353.7020001
  },
  {
    itemId: "8722d6c2-3382-406b-a2c1-74e91f3f5784",
    title: "Paso Robles 2023",
    description: "18x24  in. oil on canvas  , private collection ",
    orderIndex: -1685759353.701
  },
  {
    itemId: "27b72776-ff8e-4541-930f-fdd93f5d2f5a",
    title: "And after the rain",
    description: "24x24 in , oil on canvas  (2023 ), private collection ",
    orderIndex: -1680645389.7299998
  },
  {
    itemId: "da2985b8-5dbf-4c2f-a497-41b64ef73c09",
    title: "Peru",
    description: "16x20 in oil on canvas ( 2020)",
    orderIndex: -1659406771.5640001
  },
  {
    itemId: "2cd8572b-fd51-462c-9743-93c996c49a67",
    title: "Red ball",
    description: "48x60in,oil on canvas 2021, private collection ",
    orderIndex: -1655902687.4543028
  },
  {
    itemId: "5f820f0c-583d-4817-9893-dda129011dc2",
    title: "Por Paso Robles",
    description: "48x60 in oil on canvas 2020(private collection )",
    orderIndex: -1644761563.0640001
  },
  {
    itemId: "f181a4fc-dd55-4b5d-9592-91b420f240f1",
    title: "Fog on Campbell",
    description: "48x60 in, oil on canvas 2021",
    orderIndex: -1643584965.197257
  },
  {
    itemId: "50151f13-cc07-4095-b05a-270c53b4dc87",
    title: "La Rueda",
    description: "48x60 in oil on canvas  2021",
    orderIndex: -1637538501.4738395
  },
  {
    itemId: "c2197030-d6b3-417c-b5b1-131d5e91025a",
    title: "El solitario",
    description: "16x20  in oil on canvas 2021 ,private collection ",
    orderIndex: -1637438959.1265001
  },
  {
    itemId: "2aee9d5b-b7a2-4006-9281-8779164cbff6",
    title: "La tarde",
    description: "16x20 in oil on canvas  2021,private collection ",
    orderIndex: -1634742754.9173574
  },
  {
    itemId: "f638d0a0-2930-4482-a61b-1fbdb27a4eaf",
    title: "My girls",
    description: "16x20 in oil on canvas 2021 ,private collection ",
    orderIndex: -1634260206.3500538
  },
  {
    itemId: "d23c8e39-e378-4ceb-a4fd-333b1d20dff4",
    title: "La Tarde (large)",
    description: "30 x48 in oil on canvas 2021 (private collection )",
    orderIndex: -1633777657.7827501
  },
  {
    itemId: "86a86c4a-702b-4ecc-b4a5-b6f3f1e9b0fa",
    title: "Campbell tower",
    description: "30x24 in oil on canvas(2022)private collection ",
    orderIndex: -1630116354.0952501
  },
  {
    itemId: "6af2e51f-5bad-444c-bdd3-0a5010845fae",
    title: "La casa roja",
    description: "16x20 in oil on canvas 2022,",
    orderIndex: -1630116354.0171251
  },
  {
    itemId: "994347f0-67fc-45f7-9376-05ca730c9055",
    title: "After the storm, man and dog",
    description: "16x20in  oil on canvas  2023",
    orderIndex: -1630116354.0104113
  },
  {
    itemId: "e429678a-807e-440a-b181-9af3c38508ba",
    title: "La Pollera",
    description: "16x20 in oil on canvas 2023",
    orderIndex: -1630116354.0036974
  },
  {
    itemId: "a08b45c0-c520-4c4b-84e9-fe185ee6c7e0",
    title: "La marchanta",
    description: "16x20in oil on canvas  2023 ",
    orderIndex: -1630116354.0033922
  },
  {
    itemId: "211dd066-3a31-4553-a508-c023ecaea6a5",
    title: "La senora del Cabo",
    description: "48x60 in  oil on canvas  2022",
    orderIndex: -1630116354.003087
  },
  {
    itemId: "01bac6e3-0a66-479f-b5db-13355646b287",
    title: "La mujer de Vallarta",
    description: "48x60 in oil on canvas 2022",
    orderIndex: -1630116354.0024767
  },
  {
    itemId: "0c24c2af-5af5-4dc1-9053-ecec495c8a1c",
    title: "Carmen",
    description: "48 x 30 in oil on canvas 2021 ( private collection )",
    orderIndex: -1630116353.9780626
  },
  {
    itemId: "9cad719a-ba15-4939-82fd-d37969569d14",
    title: "Yellow shoes",
    description: "48x60 in, mix media on canvas 2021",
    orderIndex: -1630116247.1356642
  },
  {
    itemId: "d1ce479d-f2bc-45e9-81a2-d7c3966a140a",
    title: "La vendedora",
    description: "16x20 in oil on canvas 2023",
    orderIndex: -1630116233.7803645
  }
].sort((a, b) => a.orderIndex - b.orderIndex) // Sort by orderIndex ascending (most negative first)

// Clean up title (remove extra quotes and whitespace)
function cleanTitle(title) {
  return title
    .replace(/^[""\s]+|[""\s]+$/g, '') // Remove leading/trailing quotes and spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Parse description to extract dimensions, medium, year, and notes
function parseDescription(desc) {
  if (!desc) return { dimensions: null, medium: null, year: null, notes: null }

  // Clean up the description
  const cleaned = desc.replace(/\s+/g, ' ').trim()

  // Extract year (4 digits, typically 2020-2024)
  const yearMatch = cleaned.match(/\b(20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  // Extract dimensions (patterns like "16x20 in", "48x60in", "16 x20", etc.)
  const dimMatch = cleaned.match(/(\d+\s*x\s*\d+)\s*in\.?/i)
  const dimensions = dimMatch ? dimMatch[1].replace(/\s+/g, '') + ' in' : null

  // Extract medium (oil on canvas, mix media, etc.)
  let medium = 'Oil on canvas' // default
  if (/mix\s*media/i.test(cleaned)) {
    medium = 'Mixed media on canvas'
  } else if (/oil\s*on\s*canvas/i.test(cleaned)) {
    medium = 'Oil on canvas'
  }

  // Extract notes (private collection, etc.)
  let notes = null
  if (/private\s*collection/i.test(cleaned)) {
    notes = 'Private collection'
  }

  return { dimensions, medium, year, notes }
}

// Spanish translations for medium
const mediumTranslations = {
  'Oil on canvas': 'Óleo sobre lienzo',
  'Mixed media on canvas': 'Técnica mixta sobre lienzo',
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Sync Wix Metadata to Sanity')
  console.log('═'.repeat(60))
  console.log(`\nProject: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  console.log(`\nWix paintings to sync: ${wixPaintings.length}`)

  // Verify token exists
  if (!env.SANITY_API_TOKEN) {
    console.error('\n✗ Error: SANITY_API_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Prepare the metadata for all paintings
  const allPaintingsMetadata = []

  // Process Wix paintings (first 25)
  console.log('\n─'.repeat(60))
  console.log('Processing Wix metadata...\n')

  for (let i = 0; i < wixPaintings.length; i++) {
    const wix = wixPaintings[i]
    const order = i + 1
    const title = cleanTitle(wix.title)
    const parsed = parseDescription(wix.description)

    console.log(`[${order}] "${title}"`)
    console.log(`    Dimensions: ${parsed.dimensions || 'N/A'}`)
    console.log(`    Medium: ${parsed.medium || 'N/A'}`)
    console.log(`    Year: ${parsed.year || 'N/A'}`)
    if (parsed.notes) console.log(`    Notes: ${parsed.notes}`)

    allPaintingsMetadata.push({
      order,
      wixItemId: wix.itemId,
      title: { en: title, es: title }, // Keep original title for both languages
      dimensions: parsed.dimensions,
      medium: {
        en: parsed.medium,
        es: mediumTranslations[parsed.medium] || parsed.medium
      },
      year: parsed.year,
      notes: parsed.notes,
      rawDescription: wix.description
    })
  }

  // Add placeholder entries for paintings 26-52
  for (let i = 26; i <= 52; i++) {
    allPaintingsMetadata.push({
      order: i,
      wixItemId: null,
      title: { en: `Painting ${i.toString().padStart(2, '0')}`, es: `Pintura ${i.toString().padStart(2, '0')}` },
      dimensions: null,
      medium: { en: 'Oil on canvas', es: 'Óleo sobre lienzo' },
      year: null,
      notes: null,
      rawDescription: null
    })
  }

  // Save metadata to JSON file
  const dataDir = path.join(__dirname, '../data')
  const jsonPath = path.join(dataDir, 'paintings-metadata.json')

  fs.writeFileSync(jsonPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/paintings',
    totalCount: allPaintingsMetadata.length,
    wixCount: wixPaintings.length,
    paintings: allPaintingsMetadata
  }, null, 2))

  console.log(`\n✓ Saved metadata to: ${jsonPath}`)

  // Now update Sanity documents
  console.log('\n─'.repeat(60))
  console.log('Updating Sanity documents...\n')

  let successCount = 0
  let failCount = 0

  for (const painting of allPaintingsMetadata.slice(0, 25)) { // Only update first 25
    const { order, title, dimensions, medium, year } = painting
    const paddedOrder = order.toString().padStart(2, '0')

    try {
      // Find the Sanity document by order field
      const query = `*[_type == "artwork" && category == "painting" && order == $order][0]`
      const doc = await client.fetch(query, { order })

      if (!doc) {
        console.log(`[${paddedOrder}] ✗ No Sanity document found with order=${order}`)
        failCount++
        continue
      }

      // Generate slug from title
      const slug = title.en
        .toLowerCase()
        .replace(/[""]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Update the document
      const updates = {
        title,
        'slug.current': slug,
        medium,
      }

      if (dimensions) updates.dimensions = dimensions
      if (year) updates.year = year

      await client.patch(doc._id).set(updates).commit()

      // Store the Sanity ID in our metadata
      painting.sanityId = doc._id

      console.log(`[${paddedOrder}] ✓ Updated: "${title.en}" (${doc._id})`)
      successCount++
    } catch (error) {
      console.log(`[${paddedOrder}] ✗ Error: ${error.message}`)
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Re-save metadata with Sanity IDs
  fs.writeFileSync(jsonPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/paintings',
    totalCount: allPaintingsMetadata.length,
    wixCount: wixPaintings.length,
    paintings: allPaintingsMetadata
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Sync Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Updated: ${successCount}`)
  console.log(`  ✗ Failed:  ${failCount}`)
  console.log(`  📄 JSON:   ${jsonPath}`)
  console.log('\n✓ Done! Check your Sanity Studio to verify the updates.')
}

main().catch(console.error)
