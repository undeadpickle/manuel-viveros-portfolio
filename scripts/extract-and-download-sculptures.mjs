import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// All 51 sculptures extracted from Wix gallery
const wixSculptures = [
  {order:1,itemId:"2e091e97-9779-4bf4-aeac-2a9095805734",mediaUrl:"a7c938_21b00ae99c6c47b1944902a699f1b002~mv2.jpg",title:"Pensando",description:"13x8x5in, bronze  2004"},
  {order:2,itemId:"d255e5ae-1aa6-4a80-b30a-b7babb697d89",mediaUrl:"a7c938_ff03ab36fcde44c79d250601310e6118~mv2.jpg",title:"Pensando",description:"13x8x5 in , bronze ,2004"},
  {order:3,itemId:"1cd82a1f-707e-4326-a1b6-d110607112e5",mediaUrl:"a7c938_756b83e500fa4b9cb1037352b6c41d7f~mv2.jpg",title:"Lost in love",description:"7.5x7.5x10 in , bronze 1996"},
  {order:4,itemId:"1a1b0341-a9fd-4bd3-a2a0-66d18aca9412",mediaUrl:"a7c938_1e936ad8f48b491a8c11f758597653c3~mv2.jpg",title:"Lost in love",description:"7.5x7.5x10 in , bronze 1996"},
  {order:5,itemId:"3751a03a-b3d1-45b6-944c-d79d7ae137a4",mediaUrl:"a7c938_021d3dd60a044241ac8f61dbf328178b~mv2.jpg",title:"El triste",description:"10x11x6 in, bronze 2007"},
  {order:6,itemId:"929e2ce7-8ad6-46dd-8b14-e74edfa43f15",mediaUrl:"a7c938_62a06faa7d3d43bca49d3c8f05bf1a6f~mv2.jpg",title:"El triste",description:"10x11x6in, bronze  2007"},
  {order:7,itemId:"e95e3eca-f8a5-4dc6-a7e3-1f7364a42938",mediaUrl:"a7c938_91e106ad11be4ef0b5c2cf3f7bf2db29~mv2.jpg",title:"Con mis nietas",description:"14x13x8 in bronze  2011"},
  {order:8,itemId:"750e3512-f552-4035-8d49-945958b75549",mediaUrl:"a7c938_113c49094eb6496e9d7a35010a63879f~mv2.jpg",title:"Con mis nietas",description:"14x13x8 in bronze ,2011"},
  {order:9,itemId:"9b6851a4-0edc-4865-a798-2458c4b9e239",mediaUrl:"a7c938_e9272bf183b44610a84ef2afa2d3d89d~mv2.jpg",title:"Soledad series",description:"10x22x8 in, bronze  2002"},
  {order:10,itemId:"72810d67-eb67-432e-ad65-9096f43e20ef",mediaUrl:"a7c938_834f43166527498fa61a43bf6d2f05f9~mv2.jpg",title:"Soledad series",description:"10x22x8 in bronze  2002"},
  {order:11,itemId:"914c7253-15df-4c3d-ba85-a62e27027dc2",mediaUrl:"a7c938_7033c97f97aa471088c6c75da86b0afe~mv2.jpg",title:"Pasando",description:"21x5.5x9 in , bronze sculpture 2005"},
  {order:12,itemId:"1ca6793f-8005-4916-a29d-e2e8c668f2be",mediaUrl:"a7c938_eb5340dc148b47f79a1aeac3c6553d32~mv2.jpg",title:"Pasando",description:"21x5.5x9  in, bronze sculpture 2005"},
  {order:13,itemId:"f561e059-7813-494a-a691-375727968978",mediaUrl:"a7c938_3a450634a6244aeab7450614522cd39b~mv2.jpg",title:"A la madre",description:"13x10x8.5 in bronze sculpture  2000"},
  {order:14,itemId:"ea213ac3-78c6-4856-b46d-255f9b27c5eb",mediaUrl:"a7c938_7114fedfa02d4c0f820b8ed12a9f5f70~mv2.jpg",title:"A la madre",description:"Bronze sculpture 13x10x8.5 in, 2000"},
  {order:15,itemId:"dc6fa7ba-9760-489f-b918-0eed0779cb62",mediaUrl:"aa9b4e_0952164ca8404dd6807b13061508eda1~mv2.jpg",title:"",description:""},
  {order:16,itemId:"f900745a-af69-49a3-8c79-99d59f36e146",mediaUrl:"aa9b4e_78ab860c93134ab182dd9cf00475b4f8~mv2.jpg",title:"Sketching",description:"10x8x10 in ,bronze sculpture 2002"},
  {order:17,itemId:"b580c38e-2c38-4717-a2a4-f7681152e74e",mediaUrl:"aa9b4e_0cb5132236894992bd38741f24d39e9e~mv2.jpg",title:"",description:""},
  {order:18,itemId:"78036447-fab1-4322-9ba3-13680b168903",mediaUrl:"aa9b4e_f4816bc1471e46c9a4dc2b7e4133e0d1~mv2.jpg",title:"Madre",description:"17x8x9in bronze sculpture 2010"},
  {order:19,itemId:"709647bd-5214-4688-820b-6b883185d711",mediaUrl:"a7c938_492138a32de643998aea5757a712667a~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:20,itemId:"2f166ed1-056d-45ff-b97c-27c0805a382d",mediaUrl:"a7c938_4c98d1cd02f548c3ad8a6027ea05b0e5~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:21,itemId:"f3952925-56b1-4a52-b29c-64dfebbd7ad6",mediaUrl:"a7c938_b28566bbad2c4faa909152d41ff0000a~mv2_d_2048_3139_s_2.jpg",title:"Amazon woman (private collection)",description:"Bronze sculpture"},
  {order:22,itemId:"538a70ae-b065-43d6-adef-07c239d41cdd",mediaUrl:"a7c938_ffec2d82e56a46b6b08590f64b6b46bb~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:23,itemId:"1af540d3-430d-4df2-9b0a-ce5fd3a4cc45",mediaUrl:"a7c938_df168ec70a41402c946b547f68016c51~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:24,itemId:"9d4313ab-a475-4c50-8a5b-3839228d37a4",mediaUrl:"a7c938_219c3318e07e4d53b55ff38632596ace~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:25,itemId:"3b914eff-284c-467f-a91b-3392f9bd2780",mediaUrl:"a7c938_6798197742b34cffad49865e5f285f5a~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:26,itemId:"346e5fab-cd54-484b-97ed-3643794ec87d",mediaUrl:"a7c938_f7b4ad4833914195af6015772bcd286d~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:27,itemId:"beb792db-e551-41fb-bcf8-b063d2410511",mediaUrl:"a7c938_4905a7d9c3dd4a29b0524c9765b8586e~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:28,itemId:"5c2097f1-f66a-416c-8801-01233ef54383",mediaUrl:"a7c938_d7870dfffb054f14ab07f79481f0d8d1~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:29,itemId:"21c6955e-818e-49ed-bca6-5553e8b00566",mediaUrl:"a7c938_afe9de90e6b64986808dd4cf24ce9f40~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:30,itemId:"eb009b86-15ff-485f-9b0e-c5251c5acff1",mediaUrl:"a7c938_2f7fdb5c76cc42e0b4119504d7a56368~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:31,itemId:"2c8a5c8b-fc4c-4763-9690-e14efc698958",mediaUrl:"a7c938_c11ab2d24d4a4b0a912bd41318f7f3ec~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:32,itemId:"fcd3ba62-ff57-4a68-bfc3-64c16c760433",mediaUrl:"a7c938_60c6a4c9f2f44af184383a2fe439b9a1~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:33,itemId:"0d8cd552-5f1f-4add-afd8-5d71cb33e24e",mediaUrl:"a7c938_e6a34db3f86042d4a48330ed6d10d57c~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:34,itemId:"3748cc31-297c-4c70-85c8-e703f138e599",mediaUrl:"a7c938_9823ef70102a4920b031660cab695454~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:35,itemId:"aa1bc893-72a5-4796-a886-2ca061c00704",mediaUrl:"a7c938_ab56b82d21d14794a9c94b3e559c94e1~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:36,itemId:"25b751e4-7971-4e16-95ec-291b446c8204",mediaUrl:"a7c938_51b8955d195b46409500e1d02527ce13~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:37,itemId:"b8503c8e-d0ba-46d8-acf5-2b0b2b9810d9",mediaUrl:"a7c938_73561768f0134c04a3d0717ec4a30f42~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:38,itemId:"bf5bd752-2ab2-4931-94c4-4c3d66790e92",mediaUrl:"a7c938_b9c16c87f40f4b13ab2f8867aecf5530~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:39,itemId:"94d59422-c488-4a8a-9909-37fb501ed816",mediaUrl:"a7c938_bd3e2bd989f348f48a1463f4c3f7656d~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:40,itemId:"3f8e3040-1185-4d00-bcec-5d1645318ef8",mediaUrl:"a7c938_0e69796fd05e46e9b7126448ca9494e3~mv2_d_2048_3139_s_2.jpg",title:"",description:""},
  {order:41,itemId:"611a5d38-e440-4ad2-9ee9-49a9d12b1b73",mediaUrl:"a7c938_c95a0fa6199b4cd4aa1e97b37d462feb~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:42,itemId:"bb040359-73a0-4201-b2da-3ea8b504ff5f",mediaUrl:"a7c938_b36864d879844b5bb605cccf077b75c5~mv2_d_3139_2048_s_2.jpg",title:"",description:""},
  {order:43,itemId:"551a2ee3-12c5-4ea2-97c5-5144b4176755",mediaUrl:"a7c938_0bb88b40504c420da0e5038131f5b764~mv2.jpg",title:"",description:""},
  {order:44,itemId:"8ab35504-e49d-4dee-b959-f6b1502c7a73",mediaUrl:"a7c938_89d8222dde834f05af243c1788f75c4f~mv2.jpg",title:"",description:""},
  {order:45,itemId:"0deb1ac4-3af7-430f-8259-5147c1d43a8b",mediaUrl:"a7c938_b7e21da03a4d40e3a76f6f40770186d7~mv2.jpg",title:"",description:""},
  {order:46,itemId:"ee97b028-3f5e-4980-b899-46311ec5f71e",mediaUrl:"a7c938_311af34099484aeaa44d457c6f854e01~mv2.jpg",title:"",description:""},
  {order:47,itemId:"97307817-722a-48ee-a582-a4faa25d5022",mediaUrl:"a7c938_8947b184da9145aa9bb16ade6eeb4cf5~mv2.jpg",title:"",description:""},
  {order:48,itemId:"4f39b29b-ba9a-470e-b5a9-14c173c65edf",mediaUrl:"a7c938_aa71705b5a0943808f47e7e8bbd7a282~mv2.jpg",title:"",description:""},
  {order:49,itemId:"773da9e8-5331-4c66-b0a4-35a9c5df1ff7",mediaUrl:"a7c938_1a1a309f726c4082be0a966e718b515b~mv2.jpg",title:"",description:""},
  {order:50,itemId:"862d72c3-e191-42b5-9d91-14de62777600",mediaUrl:"a7c938_2556302dd0e24b3c8c29437df3f03615~mv2.jpg",title:"",description:""},
  {order:51,itemId:"72c234da-e4fa-47ab-96c1-f426cee7a457",mediaUrl:"a7c938_98281412fa6d4dc4886665849319e367~mv2.jpg",title:"",description:""}
]

// Medium translations
const mediumTranslations = {
  'Bronze': 'Bronce',
  'Stone': 'Piedra',
  'Wood': 'Madera',
  'Mixed media': 'Técnica mixta',
  'Clay': 'Arcilla',
  'Bronze sculpture': 'Escultura en bronce',
}

// Clean title (remove curly quotes and extra whitespace)
function cleanTitle(title) {
  if (!title) return null
  return title
    .replace(/[""]/g, '"')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .trim() || null
}

// Parse description to extract dimensions, medium, year
function parseDescription(desc) {
  if (!desc) return { dimensions: null, medium: null, year: null }

  const cleaned = desc.replace(/\s+/g, ' ').trim()

  // Extract year (4 digits, typically 1990-2024)
  const yearMatch = cleaned.match(/\b(19\d{2}|20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1]) : null

  // Extract dimensions (patterns like "13x8x5in", "10x11x6 in", etc.)
  const dimMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x?\s*(\d+(?:\.\d+)?)?\s*in\.?/i)
  let dimensions = null
  if (dimMatch) {
    if (dimMatch[3]) {
      dimensions = `${dimMatch[1]}x${dimMatch[2]}x${dimMatch[3]} in`
    } else {
      dimensions = `${dimMatch[1]}x${dimMatch[2]} in`
    }
  }

  // Extract medium
  let medium = 'Bronze' // default for sculptures
  if (/stone/i.test(cleaned)) medium = 'Stone'
  else if (/wood/i.test(cleaned)) medium = 'Wood'
  else if (/clay/i.test(cleaned)) medium = 'Clay'
  else if (/mix\s*media/i.test(cleaned)) medium = 'Mixed media'

  return { dimensions, medium, year }
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(true)
          })
        }).on('error', reject)
      } else {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(true)
        })
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Sculpture Extraction & Download')
  console.log('═'.repeat(60))

  const outputDir = path.join(__dirname, '../public/images/sculptures/original')
  const dataDir = path.join(__dirname, '../data')

  // Create directories
  fs.mkdirSync(outputDir, { recursive: true })
  fs.mkdirSync(dataDir, { recursive: true })

  console.log(`\nTotal sculptures: ${wixSculptures.length}`)
  console.log(`Output directory: ${outputDir}`)

  // Process all sculptures
  const processedSculptures = []
  let downloadedCount = 0
  let skippedCount = 0
  let failedCount = 0

  console.log('\n─'.repeat(60))
  console.log('Processing sculptures...\n')

  for (const sculpture of wixSculptures) {
    const paddedOrder = sculpture.order.toString().padStart(2, '0')
    const filename = `sculpture_${paddedOrder}.jpg`
    const filepath = path.join(outputDir, filename)

    // Clean title
    const cleanedTitle = cleanTitle(sculpture.title)
    const hasMetadata = !!cleanedTitle

    // Parse description
    const parsed = parseDescription(sculpture.description)

    // Generate title (use cleaned title or generic)
    const title = cleanedTitle || `Sculpture ${paddedOrder}`

    // Build full-resolution URL
    const wixImageUrl = `https://static.wixstatic.com/media/${sculpture.mediaUrl}`

    // Try to get higher resolution
    const highResUrl = wixImageUrl.replace(/\/v1\/fill\/[^/]+\//, '/v1/fill/w_2000,h_2000,q_90/')

    const item = {
      order: sculpture.order,
      localFile: filename,
      wixItemId: sculpture.itemId,
      wixImageUrl,
      title: { en: title, es: title },
      dimensions: parsed.dimensions,
      medium: {
        en: parsed.medium,
        es: mediumTranslations[parsed.medium] || parsed.medium
      },
      year: parsed.year,
      hasOriginalMetadata: hasMetadata,
      rawDescription: sculpture.description || null
    }

    // Check if already downloaded
    if (fs.existsSync(filepath)) {
      console.log(`[${paddedOrder}] ✓ Already exists: "${title}"`)
      skippedCount++
    } else {
      try {
        console.log(`[${paddedOrder}] Downloading: "${title}"...`)
        await downloadImage(wixImageUrl, filepath)
        console.log(`[${paddedOrder}] ✓ Downloaded`)
        downloadedCount++

        // Small delay to be nice to the server
        await new Promise(r => setTimeout(r, 200))
      } catch (error) {
        console.log(`[${paddedOrder}] ✗ Failed: ${error.message}`)
        failedCount++
      }
    }

    processedSculptures.push(item)
  }

  // Save metadata JSON
  const jsonPath = path.join(dataDir, 'sculptures-wix-data.json')
  fs.writeFileSync(jsonPath, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/sculpture',
    totalCount: processedSculptures.length,
    withMetadata: processedSculptures.filter(s => s.hasOriginalMetadata).length,
    sculptures: processedSculptures
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Extraction Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  Downloaded:  ${downloadedCount}`)
  console.log(`  Skipped:     ${skippedCount}`)
  console.log(`  Failed:      ${failedCount}`)
  console.log(`  With meta:   ${processedSculptures.filter(s => s.hasOriginalMetadata).length}`)
  console.log(`  Without:     ${processedSculptures.filter(s => !s.hasOriginalMetadata).length}`)
  console.log(`\n  JSON saved:  ${jsonPath}`)
  console.log(`  Images dir:  ${outputDir}`)
  console.log('\n✓ Done! Next step: Run optimize-sculptures.mjs')
}

main().catch(console.error)
