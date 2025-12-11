import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import https from 'https'

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
const DATA_DIR = path.join(__dirname, '../data')
const TEMP_DIR = path.join(__dirname, '../.temp-wix-images')

// Wix painting data with image URLs (extracted from Wix Pro Gallery)
// itemId -> mediaUrl mapping extracted directly from DOM data-id attributes
const wixPaintings = [
  {
    itemId: "acd6e5fd-18b1-4aeb-b4e4-43b4d5863158",
    title: "Paso Robles 2024",
    description: "16x20 in  oil on canvas  ( private collection ) ",
    mediaUrl: "a7c938_e51e3114d4af4a0a8784c437ba16542e~mv2.jpg",
    orderIndex: -1693252143.935
  },
  {
    itemId: "99816889-10a8-4d23-8525-cbee36c639d8",
    title: "Vasona lake",
    description: "16x20in.  Oil on canvas  2023  private collection ",
    mediaUrl: "a7c938_3ea1d015158a454f956e632556e86f15~mv2.jpg",
    orderIndex: -1693252133.935
  },
  {
    itemId: "3660355f-6174-4c24-a060-f78ecf8c3afb",
    title: "El arbolito",
    description: "16 x20 oil on canvas 2023  private collection ",
    mediaUrl: "a7c938_6a3b6a68bf4f4154a2058a1cf3340180~mv2.jpg",
    orderIndex: -1693252123.934
  },
  {
    itemId: "56618a8b-545d-4812-ae73-7853dc39f871",
    title: "At Vasona",
    description: "18x24 in . Oil on canvas  ,(2022)private collection ",
    mediaUrl: "a7c938_5e8707849290418fa11a28e39f14d41a~mv2.jpg",
    orderIndex: -1685759353.7020001
  },
  {
    itemId: "8722d6c2-3382-406b-a2c1-74e91f3f5784",
    title: "Paso Robles 2023",
    description: "18x24  in. oil on canvas  , private collection ",
    mediaUrl: "a7c938_a48aa4d5e45f40618c7e1477a35cfd03~mv2.jpg",
    orderIndex: -1685759353.701
  },
  {
    itemId: "27b72776-ff8e-4541-930f-fdd93f5d2f5a",
    title: "And after the rain",
    description: "24x24 in , oil on canvas  (2023 ), private collection ",
    mediaUrl: "a7c938_775a76ee774a4d5ba3fe850b1ad2c6ae~mv2.png",
    orderIndex: -1680645389.7299998
  },
  {
    itemId: "da2985b8-5dbf-4c2f-a497-41b64ef73c09",
    title: "Peru",
    description: "16x20 in oil on canvas ( 2020)",
    mediaUrl: "a7c938_2b20182079224a18b580b8665e105089~mv2.jpg",
    orderIndex: -1659406771.5640001
  },
  {
    itemId: "2cd8572b-fd51-462c-9743-93c996c49a67",
    title: "Red ball",
    description: "48x60in,oil on canvas 2021, private collection ",
    mediaUrl: "a7c938_ce4c7b74286c4ae4a4cdab09095add82~mv2.jpg",
    orderIndex: -1655902687.4543028
  },
  {
    itemId: "5f820f0c-583d-4817-9893-dda129011dc2",
    title: "Por Paso Robles",
    description: "48x60 in oil on canvas 2020(private collection )",
    mediaUrl: "a7c938_75c7f1251bdc4f9fb7fb79ec4f949bec~mv2.jpg",
    orderIndex: -1644761563.0640001
  },
  {
    itemId: "f181a4fc-dd55-4b5d-9592-91b420f240f1",
    title: "Fog on Campbell",
    description: "48x60 in, oil on canvas 2021",
    mediaUrl: "a7c938_2a0e9521d9074618998ac3acdc2f9509~mv2.jpg",
    orderIndex: -1643584965.197257
  },
  {
    itemId: "50151f13-cc07-4095-b05a-270c53b4dc87",
    title: "La Rueda",
    description: "48x60 in oil on canvas  2021",
    mediaUrl: "a7c938_f5d2da6e36614537bdd6094e22558ad4~mv2.png",
    orderIndex: -1637538501.4738395
  },
  {
    itemId: "c2197030-d6b3-417c-b5b1-131d5e91025a",
    title: "El solitario",
    description: "16x20  in oil on canvas 2021 ,private collection ",
    mediaUrl: "a7c938_194a4cb564634ae3b9f40678f670b024~mv2.jpg",
    orderIndex: -1637438959.1265001
  },
  {
    itemId: "2aee9d5b-b7a2-4006-9281-8779164cbff6",
    title: "La tarde",
    description: "16x20 in oil on canvas  2021,private collection ",
    mediaUrl: "a7c938_e63833e888b24cb2a073310d2a39a32d~mv2.png",
    orderIndex: -1634742754.9173574
  },
  {
    itemId: "f638d0a0-2930-4482-a61b-1fbdb27a4eaf",
    title: "My girls",
    description: "16x20 in oil on canvas 2021 ,private collection ",
    mediaUrl: "a7c938_d47bb638bb1e449680f55f2ba75e42cb~mv2.png",
    orderIndex: -1634260206.3500538
  },
  {
    itemId: "d23c8e39-e378-4ceb-a4fd-333b1d20dff4",
    title: "La Tarde (large)",
    description: "30 x48 in oil on canvas 2021 (private collection )",
    mediaUrl: "a7c938_d017cbfe2cd44e429953219818eda1b9~mv2.jpg",
    orderIndex: -1633777657.7827501
  },
  {
    itemId: "86a86c4a-702b-4ecc-b4a5-b6f3f1e9b0fa",
    title: "Campbell tower",
    description: "30x24 in oil on canvas(2022)private collection ",
    mediaUrl: "a7c938_067fa3ad37c04197bcb37c637f70fda7~mv2.jpg",
    orderIndex: -1630116354.0952501
  },
  {
    itemId: "6af2e51f-5bad-444c-bdd3-0a5010845fae",
    title: "La casa roja",
    description: "16x20 in oil on canvas 2022,",
    mediaUrl: "a7c938_882a1c5866b94dc3ac1fd6396d07ecec~mv2.jpg",
    orderIndex: -1630116354.0171251
  },
  {
    itemId: "994347f0-67fc-45f7-9376-05ca730c9055",
    title: "After the storm, man and dog",
    description: "16x20in  oil on canvas  2023",
    mediaUrl: "a7c938_294de8ef595d4c91b30af22be423ebc2~mv2.jpg",
    orderIndex: -1630116354.0104113
  },
  {
    itemId: "e429678a-807e-440a-b181-9af3c38508ba",
    title: "La Pollera",
    description: "16x20 in oil on canvas 2023",
    mediaUrl: "a7c938_04a82c7d40754c01bf72cd2d7594b829~mv2.jpg",
    orderIndex: -1630116354.0036974
  },
  {
    itemId: "a08b45c0-c520-4c4b-84e9-fe185ee6c7e0",
    title: "La marchanta",
    description: "16x20in oil on canvas  2023 ",
    mediaUrl: "a7c938_c7556995b9a34f7ab458de02965a8f6b~mv2.jpg",
    orderIndex: -1630116354.0033922
  },
  {
    itemId: "211dd066-3a31-4553-a508-c023ecaea6a5",
    title: "La senora del Cabo",
    description: "48x60 in  oil on canvas  2022",
    mediaUrl: "a7c938_287560faabf2474ca9ca8aa259ed68f4~mv2.jpg",
    orderIndex: -1630116354.003087
  },
  {
    itemId: "01bac6e3-0a66-479f-b5db-13355646b287",
    title: "La mujer de Vallarta",
    description: "48x60 in oil on canvas 2022",
    mediaUrl: "a7c938_7ad9fadd20ee47e0a6ecf01b01639cef~mv2.jpg",
    orderIndex: -1630116354.0024767
  },
  {
    itemId: "0c24c2af-5af5-4dc1-9053-ecec495c8a1c",
    title: "Carmen",
    description: "48 x 30 in oil on canvas 2021 ( private collection )",
    mediaUrl: "a7c938_3259006f06584a54b244ffd3eecee260~mv2.jpg",
    orderIndex: -1630116353.9780626
  },
  {
    itemId: "9cad719a-ba15-4939-82fd-d37969569d14",
    title: "Yellow shoes",
    description: "48x60 in, mix media on canvas 2021",
    mediaUrl: "a7c938_9fefe15cbd0940d7b3842d4434d75f0c~mv2.jpg",
    orderIndex: -1630116247.1356642
  },
  {
    itemId: "d1ce479d-f2bc-45e9-81a2-d7c3966a140a",
    title: "La vendedora",
    description: "16x20 in oil on canvas 2023",
    mediaUrl: "a7c938_15df9b77e0124cc3aa0f4c1687869df0~mv2.jpg",
    orderIndex: -1630116233.7803645
  }
].sort((a, b) => a.orderIndex - b.orderIndex)

// Clean up title
function cleanTitle(title) {
  return title
    .replace(/^[""\s]+|[""\s]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse description to extract dimensions, medium, year
function parseDescription(desc) {
  if (!desc) return { dimensions: null, medium: null, year: null, notes: null }

  const cleaned = desc.replace(/\s+/g, ' ').trim()

  const yearMatch = cleaned.match(/\b(20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  const dimMatch = cleaned.match(/(\d+\s*x\s*\d+)\s*in\.?/i)
  const dimensions = dimMatch ? dimMatch[1].replace(/\s+/g, '') + ' in' : null

  let medium = 'Oil on canvas'
  if (/mix\s*media/i.test(cleaned)) {
    medium = 'Mixed media on canvas'
  }

  const notes = /private\s*collection/i.test(cleaned) ? 'Private collection' : null

  return { dimensions, medium, year, notes }
}

// Spanish translations
const mediumTranslations = {
  'Oil on canvas': 'Óleo sobre lienzo',
  'Mixed media on canvas': 'Técnica mixta sobre lienzo',
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(true)
          })
        }).on('error', reject)
      } else if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(true)
        })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

// Generate a simple perceptual hash using average color in grid
async function getImageHash(imagePath) {
  try {
    // Resize to small grid and get raw pixels
    const { data } = await sharp(imagePath)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Calculate average
    const avg = data.reduce((sum, val) => sum + val, 0) / data.length

    // Generate hash based on whether each pixel is above/below average
    let hash = ''
    for (let i = 0; i < data.length; i++) {
      hash += data[i] >= avg ? '1' : '0'
    }

    return hash
  } catch (error) {
    console.error(`Error hashing ${imagePath}:`, error.message)
    return null
  }
}

// Calculate Hamming distance between two hashes
function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return Infinity
  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++
  }
  return distance
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Match and Sync Paintings')
  console.log('═'.repeat(60))
  console.log(`\nProject: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Wix paintings: ${wixPaintings.length}`)

  // Ensure directories exist
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Get local images
  const localFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/(\d+)/)?.[1] || '0')
      return numA - numB
    })

  console.log(`Local images: ${localFiles.length}`)

  // Step 1: Download Wix images and compute hashes
  console.log('\n─'.repeat(60))
  console.log('Step 1: Downloading Wix images and computing hashes...\n')

  const wixHashes = []
  for (const wix of wixPaintings) {
    const wixUrl = `https://static.wixstatic.com/media/${wix.mediaUrl}`
    const tempPath = path.join(TEMP_DIR, `wix_${wix.itemId}.jpg`)

    process.stdout.write(`  Downloading ${wix.title}... `)

    try {
      if (!fs.existsSync(tempPath)) {
        await downloadImage(wixUrl, tempPath)
      }
      const hash = await getImageHash(tempPath)
      wixHashes.push({ wix, hash, tempPath })
      console.log('✓')
    } catch (error) {
      console.log(`✗ (${error.message})`)
      wixHashes.push({ wix, hash: null, tempPath: null })
    }

    await new Promise(r => setTimeout(r, 100))
  }

  // Step 2: Compute hashes for local images
  console.log('\n─'.repeat(60))
  console.log('Step 2: Computing hashes for local images...\n')

  const localHashes = []
  for (const file of localFiles) {
    const localPath = path.join(IMAGES_DIR, file)
    process.stdout.write(`  Hashing ${file}... `)

    const hash = await getImageHash(localPath)
    localHashes.push({ file, hash, localPath })
    console.log('✓')
  }

  // Step 3: Match images
  console.log('\n─'.repeat(60))
  console.log('Step 3: Matching images...\n')

  const matches = []
  const usedLocalFiles = new Set()

  for (const wixData of wixHashes) {
    if (!wixData.hash) {
      console.log(`  ${wixData.wix.title}: No hash, skipping`)
      continue
    }

    let bestMatch = null
    let bestDistance = Infinity

    for (const localData of localHashes) {
      if (usedLocalFiles.has(localData.file)) continue
      if (!localData.hash) continue

      const distance = hammingDistance(wixData.hash, localData.hash)
      if (distance < bestDistance) {
        bestDistance = distance
        bestMatch = localData
      }
    }

    if (bestMatch && bestDistance <= 15) { // Allow up to ~23% difference
      usedLocalFiles.add(bestMatch.file)
      matches.push({
        wix: wixData.wix,
        localFile: bestMatch.file,
        distance: bestDistance,
        confidence: bestDistance <= 5 ? 'high' : bestDistance <= 10 ? 'medium' : 'low'
      })
      console.log(`  ✓ "${wixData.wix.title}" → ${bestMatch.file} (distance: ${bestDistance})`)
    } else {
      console.log(`  ? "${wixData.wix.title}" → No match found (best: ${bestDistance})`)
      matches.push({
        wix: wixData.wix,
        localFile: null,
        distance: bestDistance,
        confidence: 'none'
      })
    }
  }

  // Step 4: Fetch Sanity data
  console.log('\n─'.repeat(60))
  console.log('Step 4: Fetching Sanity artwork data...\n')

  const sanityDocs = await client.fetch(`
    *[_type == "artwork" && category == "painting"] {
      _id,
      order,
      "imageUrl": image.asset->url
    }
  `)

  console.log(`  Found ${sanityDocs.length} artwork documents in Sanity`)

  // Create lookup by order
  const sanityByOrder = {}
  for (const doc of sanityDocs) {
    sanityByOrder[doc.order] = doc
  }

  // Step 5: Build final mapping and update Sanity
  console.log('\n─'.repeat(60))
  console.log('Step 5: Updating Sanity with matched metadata...\n')

  const finalMapping = []
  let updateCount = 0
  let skipCount = 0

  for (const match of matches) {
    if (!match.localFile) {
      skipCount++
      continue
    }

    // Extract order number from local filename
    const orderMatch = match.localFile.match(/(\d+)/)
    const order = orderMatch ? parseInt(orderMatch[1]) : null

    if (!order) {
      skipCount++
      continue
    }

    const sanityDoc = sanityByOrder[order]
    if (!sanityDoc) {
      console.log(`  ✗ No Sanity doc for order ${order}`)
      skipCount++
      continue
    }

    const title = cleanTitle(match.wix.title)
    const parsed = parseDescription(match.wix.description)

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[""]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Update Sanity
    try {
      const updates = {
        title: { en: title, es: title },
        'slug.current': slug,
        medium: {
          en: parsed.medium,
          es: mediumTranslations[parsed.medium] || parsed.medium
        }
      }
      if (parsed.dimensions) updates.dimensions = parsed.dimensions
      if (parsed.year) updates.year = parsed.year

      await client.patch(sanityDoc._id).set(updates).commit()
      console.log(`  ✓ Updated "${title}" (order: ${order})`)
      updateCount++
    } catch (error) {
      console.log(`  ✗ Error updating ${sanityDoc._id}: ${error.message}`)
    }

    // Add to final mapping
    finalMapping.push({
      order,
      localFile: match.localFile,
      wixItemId: match.wix.itemId,
      wixImageUrl: `https://static.wixstatic.com/media/${match.wix.mediaUrl}`,
      sanityId: sanityDoc._id,
      sanityImageUrl: sanityDoc.imageUrl,
      title: { en: title, es: title },
      dimensions: parsed.dimensions,
      medium: {
        en: parsed.medium,
        es: mediumTranslations[parsed.medium] || parsed.medium
      },
      year: parsed.year,
      notes: parsed.notes,
      matchConfidence: match.confidence
    })

    await new Promise(r => setTimeout(r, 100))
  }

  // Add unmatched local files (paintings without Wix metadata)
  for (const file of localFiles) {
    if (!usedLocalFiles.has(file)) {
      const orderMatch = file.match(/(\d+)/)
      const order = orderMatch ? parseInt(orderMatch[1]) : null
      const sanityDoc = order ? sanityByOrder[order] : null

      finalMapping.push({
        order,
        localFile: file,
        wixItemId: null,
        wixImageUrl: null,
        sanityId: sanityDoc?._id || null,
        sanityImageUrl: sanityDoc?.imageUrl || null,
        title: {
          en: `Painting ${order?.toString().padStart(2, '0') || '??'}`,
          es: `Pintura ${order?.toString().padStart(2, '0') || '??'}`
        },
        dimensions: null,
        medium: { en: 'Oil on canvas', es: 'Óleo sobre lienzo' },
        year: null,
        notes: null,
        matchConfidence: null
      })
    }
  }

  // Sort by order
  finalMapping.sort((a, b) => (a.order || 999) - (b.order || 999))

  // Step 6: Save JSON
  const jsonPath = path.join(DATA_DIR, 'paintings-metadata.json')
  fs.writeFileSync(jsonPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/paintings',
    totalCount: finalMapping.length,
    matchedCount: matches.filter(m => m.localFile).length,
    paintings: finalMapping
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Sync Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Updated: ${updateCount}`)
  console.log(`  ○ Skipped: ${skipCount}`)
  console.log(`  📄 JSON:   ${jsonPath}`)

  // Show match quality summary
  const highConf = matches.filter(m => m.confidence === 'high').length
  const medConf = matches.filter(m => m.confidence === 'medium').length
  const lowConf = matches.filter(m => m.confidence === 'low').length
  const noMatch = matches.filter(m => m.confidence === 'none').length

  console.log(`\n  Match Quality:`)
  console.log(`    High confidence:   ${highConf}`)
  console.log(`    Medium confidence: ${medConf}`)
  console.log(`    Low confidence:    ${lowConf}`)
  console.log(`    No match:          ${noMatch}`)

  // Cleanup temp directory
  console.log('\n  Cleaning up temp files...')
  fs.rmSync(TEMP_DIR, { recursive: true, force: true })

  console.log('\n✓ Done!')
}

main().catch(console.error)
