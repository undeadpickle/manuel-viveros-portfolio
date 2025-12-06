import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && !key.startsWith('#')) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

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

// All Wix gallery items (items 25-165 from the full gallery)
// These are additional items beyond the first 25 paintings
const additionalWixItems = [
  { itemId: "f527e30d-ba9b-4558-b114-185e56bbb9ef", mediaUrl: "a7c938_28bc77819587451e8ecd239611bec4c8~mv2.jpg" },
  { itemId: "030a8fd2-965f-4093-ac5d-c6672d9f471d", mediaUrl: "a7c938_2cbab1af8a504208a1afdc206f673342~mv2.jpg" },
  { itemId: "973207b0-613a-47a9-a580-54cf9cc93667", mediaUrl: "a7c938_be1dc3afc3ef4ca7b9639e1c35cdf0b3~mv2.jpg" },
  { itemId: "c5b2ddcf-f036-4cbc-b7d1-53d2353d66b0", mediaUrl: "a7c938_1bffed652dad471c9be3f719d68c3101~mv2.png" },
  { itemId: "2845d825-e19c-42ec-9440-5c64f41372a1", mediaUrl: "a7c938_053fd69ddeb04108814caa83507495b8~mv2.jpg" },
  { itemId: "a4039aee-e5eb-4135-bdcb-c66424dc098f", mediaUrl: "a7c938_04a256f8c9b042dbb8e134ed769a9201~mv2.jpg" },
  { itemId: "b172ecba-1c26-44c3-8239-f32b53468760", mediaUrl: "a7c938_a05df4c48bf549cc83ac8ee6f273fd88~mv2.jpg" },
  { itemId: "27d47749-a433-4a04-8cba-7695f5f72aae", mediaUrl: "a7c938_b98a53b16aca4a8a99cb345dad17fa68~mv2.jpg" },
  { itemId: "11312ddb-82f3-4414-b28f-f1a933fbee09", mediaUrl: "a7c938_793a232e4d36478f8f192612a53d3df9~mv2.jpg" },
  { itemId: "65e2346e-ebaa-4d8d-abec-ceb154b06e61", mediaUrl: "a7c938_867442f965094a2a846a8bbaaa248e1d~mv2.jpg" },
  { itemId: "d046c4ce-ba3a-4561-a819-c0d085f60363", mediaUrl: "a7c938_a040ee70f51a4a9a97b219162626952c~mv2_d_1729_2651_s_2.jpg" },
  { itemId: "e0fac716-84c5-4e11-b396-cf4071f68849", mediaUrl: "a7c938_4211be3f1af64c34913b96593c3bc6f1~mv2.png" },
  { itemId: "cf0c05d9-1500-4df8-bad3-5160dfa74be4", mediaUrl: "a7c938_c50bb169cb554f39bd9c7bfdc43a4524~mv2.jpg" },
  { itemId: "9a9ebc66-5491-4363-970c-8150e92ca277", mediaUrl: "a7c938_8b269ba6617245268e02307432f7ef7b~mv2.jpg" },
  { itemId: "ddbfbd0d-9749-4a1f-a25d-52c2c2bccb8b", mediaUrl: "a7c938_af05a236aa594d4a843b1ccc311d4d24~mv2.jpg" },
  { itemId: "629c308a-e2e7-4b9a-98f9-7f314c999b69", mediaUrl: "a7c938_32f38b93929146e9933dbaecc220303c~mv2.jpg" },
  { itemId: "a437a3db-0263-4417-9981-a19bec0866fd", mediaUrl: "a7c938_a9db58c2d4cd40b69cb00cdf29772dbb~mv2.jpg" },
  { itemId: "1d8b0cb2-cf31-4489-8945-78c3da02a293", mediaUrl: "a7c938_1faab9092f8d45ea88fcaf796d191353~mv2.jpg" },
  { itemId: "7065edff-26de-4abc-9659-15da4aec4cad", mediaUrl: "a7c938_d96107c66ebd49168d85aee73edea943~mv2.png" },
  { itemId: "1fddbbc3-a88b-4535-b282-ccec40302058", mediaUrl: "a7c938_23741a88414149a7b042737576903d12~mv2.jpg" },
  { itemId: "b3b84003-9d99-4b77-ab8e-1c4573319ed2", mediaUrl: "a7c938_2622c377e61747369c421deb4ea71e5a~mv2_d_1970_3020_s_2.jpg" },
  { itemId: "4e948756-593a-462c-babb-fb0c7f0b8543", mediaUrl: "a7c938_b70e9c88a32543429dce164c0c3251e7~mv2.jpg" },
  { itemId: "8b540e5f-f1e1-46e1-b305-8de9da21665b", mediaUrl: "a7c938_e022ed0b50e84d5eaa2f0bca5146d0cb~mv2.png" },
  { itemId: "37bda2a5-13e4-474b-a22a-111bf86a5c34", mediaUrl: "a7c938_cde9ea7a28e8447782f99145a8efb352~mv2.jpg" },
  { itemId: "2f0ab699-e0d4-4d58-bbd4-a575a3689679", mediaUrl: "a7c938_d745af777f7444a5847dd7c08d32785c~mv2.jpg" },
  { itemId: "a1a78782-c07e-4bd1-9e34-e2495c72c097", mediaUrl: "a7c938_0499ca64a9254aa7b3d245ae57f04784~mv2.jpg" },
  { itemId: "895722b0-4f7d-4f3c-9880-64e8bc0e3a6a", mediaUrl: "a7c938_c38a3803bbca439384eba5af21e92dca~mv2_d_2276_1485_s_2.jpg" },
  { itemId: "e6e09a72-c40c-4678-9ae6-64e4e36f982d", mediaUrl: "a7c938_8451a2d0a33e4eb68033ad4576e35630~mv2.jpg" },
  { itemId: "0e262f8b-eede-4e92-8f5c-c9c44d301b8b", mediaUrl: "a7c938_d1d5fdf77a7d46219b6c9daccd25d202~mv2.jpg" },
  { itemId: "2a282590-b06d-4160-8a70-e06459c12696", mediaUrl: "a7c938_8df168777acb4e6685d980c0fe40cf4b~mv2.png" },
  { itemId: "0c5fac9c-6513-4407-b5c3-a36ba202e329", mediaUrl: "a7c938_d5184d040ea04bc5b7bbcfae326f8d19~mv2.jpg" },
  { itemId: "c03f7ac3-7ee4-4341-a510-b875e8afa18b", mediaUrl: "a7c938_b71a2e8386f741a987ff1e0d5aa36d1c~mv2.png" },
  { itemId: "bc7c8da8-62ad-44ae-9d92-66c7fe70d8f8", mediaUrl: "a7c938_e02696eea61b4de7b08646933a7f3ff2~mv2.png" },
  { itemId: "69cb109f-6849-48b1-ace2-e21e544a0c1d", mediaUrl: "a7c938_10a6a51710b342318569de607d3aea83~mv2.jpg" },
  { itemId: "a717de17-21d8-434b-9d54-e5f86e3239e2", mediaUrl: "a7c938_7a6509b94d1840b29e33202af2d59019~mv2.jpg" },
  { itemId: "4fe89294-8768-4a4c-9adf-806f6fd415a0", mediaUrl: "a7c938_f3ce879104d34e4dbd6f70e26bef5e97~mv2.jpg" },
  { itemId: "f34e5b18-1550-4b6c-b806-f40025a06afb", mediaUrl: "a7c938_1c0e98f6a8bf4e31b3182a4b3e6ebda6~mv2.jpg" },
  { itemId: "a636b5d7-e961-4652-bc5e-9923ed3b54a3", mediaUrl: "a7c938_07ae3600867d49b1a6c397a7b377c1e9~mv2.jpg" },
  { itemId: "2106a35d-1af3-4d9a-8fae-a9fa031b6dae", mediaUrl: "a7c938_472d6efe7aa3475fb26747a5052f8751~mv2.jpg" },
  { itemId: "fc8a1afd-1537-4564-b20f-7150b9c11a8c", mediaUrl: "a7c938_d040c65ffeac46cabf2b04d5b9d2a779~mv2.jpg" },
  { itemId: "0fa7f188-d4b8-44a6-8c48-5380f5a1a89f", mediaUrl: "a7c938_9f535f3937564455bcf147ce35b95123~mv2.jpg" },
  { itemId: "b45d6e15-8112-4b0e-8a59-4ae8314afc8a", mediaUrl: "a7c938_4d131da4ad024a948e9b11d57b3b3159~mv2.jpg" },
  { itemId: "6de4ade6-ddcb-471b-af4d-a86eec3783c4", mediaUrl: "a7c938_b0388c6188244588b3f5b76fea6d90c8~mv2.jpg" },
  { itemId: "ab7c3946-b63a-407f-9545-5bcf70a472d0", mediaUrl: "a7c938_80bae81205d64c7098324b2461cda720~mv2.jpg" },
  { itemId: "fedff426-cb5a-4d3c-92af-5c438d0a6e6f", mediaUrl: "a7c938_50c75299b07341cbb75a7283f31a368b~mv2.jpg" },
  { itemId: "33882c3d-cd0e-4045-b4a9-597c3d793cd2", mediaUrl: "a7c938_7d592e417b0941cca1b4729e8063c87c~mv2.jpg" },
  { itemId: "6197a9d8-6510-4eed-aba3-2e43d59b1921", mediaUrl: "a7c938_c29421efcf73417daa186267d60284af~mv2.jpg" },
  { itemId: "f8ce773c-d428-4aab-be99-7df267fdb2d2", mediaUrl: "a7c938_93c0278ae1d84c87963cc20ef70b8319~mv2.jpg" },
  { itemId: "fa9c4410-c2a7-4d2d-af8a-a62acf699a4e", mediaUrl: "a7c938_69ddd86cdb9e48558d327e7f23f7bc29~mv2.jpg" },
  { itemId: "f7901f4d-079e-4e50-bf72-17b5e7359d78", mediaUrl: "a7c938_d42fdac3f1534457b072398115b10c2f~mv2.jpg" },
  { itemId: "9b9a5558-935e-45d6-a4cc-b098f2881ed5", mediaUrl: "a7c938_32b554eb8d8e4e1584e29293df166145~mv2.jpg" },
  { itemId: "b820ed30-3587-4e71-9111-19acf6d8d6cb", mediaUrl: "a7c938_afb54e01a1e947ba8b317c556af43e5c~mv2.jpg" },
  { itemId: "487832da-3c6c-4951-ad5b-008799eb2058", mediaUrl: "a7c938_b73424d636084bfb95b9b81bdc4a172c~mv2.jpg" },
  { itemId: "9d39566e-cfe2-466b-9f33-47b3461f023a", mediaUrl: "a7c938_b2f976441223446ebbc1e6fdfe2e6024~mv2.jpg" },
  { itemId: "a3752a48-bdfe-492d-ae30-fee5bad4a9c1", mediaUrl: "a7c938_f9f05ae818824cd6b21414d6d8d999ad~mv2.jpg" },
  { itemId: "ef34b07a-a09a-43ad-a761-24d00f54b529", mediaUrl: "a7c938_554010781da64424afebe348435bee36~mv2.jpg" },
  { itemId: "635b2a5c-f929-411c-995a-79f32dd0bf4e", mediaUrl: "a7c938_f9ddf93b88fa4552b41039d0169c8736~mv2.jpg" },
  { itemId: "a5f01789-4b28-487f-9949-98ceacf7da4c", mediaUrl: "a7c938_c3404c54626541e2a1ffcbd2789dd1c4~mv2.jpg" },
  { itemId: "d2d47889-cc65-4a0b-b700-2bf21c3d76a8", mediaUrl: "a7c938_6ab4efd342a74f3c99b2f609eb43b551~mv2.png" },
  { itemId: "1f9ed2d9-7af2-4092-b384-3258b86b2fee", mediaUrl: "a7c938_4aece686e6d947f8b2d588a7e5f4867b~mv2.jpg" },
  { itemId: "fde74c54-36bb-450b-8795-cc4e74e7e6d0", mediaUrl: "a7c938_d6bf148f673a4043b0742c75c2f33c0d~mv2_d_3139_2048_s_2.jpg" },
  { itemId: "7c0a389d-d8d8-4063-8f8b-833b0409116a", mediaUrl: "a7c938_aceb5445a31b4775bf4adaf1d288e448~mv2_d_3057_1995_s_2.jpg" },
  { itemId: "86bdab1a-2b77-41e7-ab72-593ebe8b68b9", mediaUrl: "a7c938_2b1f8933180c45ce9ab5c0a5e7f50582~mv2_d_2874_1875_s_2.jpg" },
  { itemId: "bb261cc7-6413-4e92-b5ce-f7b616de9a92", mediaUrl: "a7c938_ddd06380555c4b86ab69bb586938b983~mv2_d_2911_1899_s_2.jpg" },
  { itemId: "f1d3cdbb-747f-42e0-8f98-ac1797c32e1b", mediaUrl: "a7c938_4b12f1779c5f4729b59df1a8e1907e29~mv2_d_3003_1959_s_2.jpg" },
  { itemId: "4ce3b67c-5946-4d98-9fc6-7eaae59a0354", mediaUrl: "a7c938_56c6184d605645b4bf6f6844812922d2~mv2_d_2911_1899_s_2.jpg" },
  { itemId: "221703f6-b359-4a1d-9c10-f81ff7e672e7", mediaUrl: "a7c938_175a847ba4504fdc83f77753590cff8b~mv2.jpeg" },
  { itemId: "aff7dd6c-ce34-40c0-8dba-060d3236a272", mediaUrl: "a7c938_4892108fd76943b6a91199390f1f7b4b~mv2_d_1922_2946_s_2.jpg" },
  { itemId: "3a32c5cb-2839-45f4-85e3-705fed444be2", mediaUrl: "a7c938_18b8f281a10947db9aeadf088a12da72~mv2.png" },
  { itemId: "e6b44e2c-a874-4913-b2d7-b9c150cfdd57", mediaUrl: "a7c938_9b8d57dcf00040b0ae6a5147d13aa817~mv2.jpeg" },
  { itemId: "0a19d2e1-64bc-411d-8af8-477ba314cb68", mediaUrl: "a7c938_ef3ac860bc834de3a478b4d6a4de9e54~mv2.jpg" },
  { itemId: "a00438c0-0528-40f7-899a-b460e549de50", mediaUrl: "a7c938_6e799db780c64e52b3c411ddbb6d4b85~mv2.jpg" },
  { itemId: "2f35de70-d83e-47fe-b923-20e26ff81366", mediaUrl: "a7c938_7d4654d003df469d98c80d8c9a70f637~mv2.jpg" },
  { itemId: "2f3e76b8-2450-48b9-8ce4-a22e995b3747", mediaUrl: "a7c938_e8fab729db464b66a7305047f85fb309~mv2.jpg" },
  { itemId: "60072b31-2543-4c02-a282-748d6725c019", mediaUrl: "a7c938_43a9c5b385b148b5a209b569a02d14d5~mv2.jpg" },
  { itemId: "0c2c34b3-e884-4991-a239-98b883171b14", mediaUrl: "a7c938_f0663b0387314031b809f9b6c991dec4~mv2.jpg" },
  { itemId: "1ab46683-d2a9-439c-809b-1917d24fcca9", mediaUrl: "a7c938_41e8880d67ab48e6a29db2df86bd1aa8~mv2.jpg" },
  { itemId: "3b2298e5-e14a-490f-acd5-8f3fe14fb9ce", mediaUrl: "a7c938_bd1ab23406d64625acf8b631129ba3e1~mv2.jpg" },
  { itemId: "4e099df8-1956-4ddc-a442-2f40ab4ff685", mediaUrl: "a7c938_2b8ae7c06b7540d8a00b572cc0fc6998~mv2.jpg" },
  { itemId: "07260e68-1c32-4702-8b80-b30dd7c0c14c", mediaUrl: "a7c938_af01c80932534f869f5091b18e5af159~mv2.jpg" },
  { itemId: "6e6fd571-feeb-40fb-874c-5b89bc206850", mediaUrl: "a7c938_9c24a9740db64f25bcc3be40f589dbdb~mv2.jpg" },
  { itemId: "eda09df3-4e6b-4fe1-b49e-678d497f274d", mediaUrl: "a7c938_76562daf97604ccca302e4f1eabeefc8~mv2.jpg" },
  { itemId: "401c50ae-2e90-43d8-9efc-a665f46a89b6", mediaUrl: "a7c938_0bdd28a787984e0ab5b32f276bc7cccb~mv2.png" },
  { itemId: "94682288-bb74-4995-9546-f80ecf0b7adf", mediaUrl: "a7c938_2fac361bd0414cee99d281dec3ff6b5a~mv2.jpg" },
]

// Already matched local files from first script
const alreadyMatchedFiles = new Set([
  'painting_02.jpg', 'painting_04.jpg', 'painting_06.jpg', 'painting_07.jpg',
  'painting_10.jpg', 'painting_12.jpg', 'painting_13.jpg', 'painting_14.jpg',
  'painting_16.jpg', 'painting_18.jpg', 'painting_20.jpg', 'painting_21.jpg',
  'painting_22.jpg', 'painting_23.jpg', 'painting_25.jpg', 'painting_27.jpg',
  'painting_29.jpg', 'painting_32.jpg', 'painting_39.jpg', 'painting_40.jpg',
  'painting_41.jpg', 'painting_42.jpg', 'painting_43.jpg', 'painting_44.jpg',
  'painting_45.jpg'
])

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => { file.close(); resolve(true) })
        }).on('error', reject)
      } else if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => { file.close(); resolve(true) })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

async function getImageHash(imagePath) {
  try {
    const { data } = await sharp(imagePath)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const avg = data.reduce((sum, val) => sum + val, 0) / data.length
    let hash = ''
    for (let i = 0; i < data.length; i++) {
      hash += data[i] >= avg ? '1' : '0'
    }
    return hash
  } catch (error) {
    return null
  }
}

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
  console.log('  Match Remaining Paintings')
  console.log('═'.repeat(60))

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }

  // Get unmatched local files
  const allLocalFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/(\d+)/)?.[1] || '0')
      return numA - numB
    })

  const unmatchedFiles = allLocalFiles.filter(f => !alreadyMatchedFiles.has(f))
  console.log(`\nUnmatched local files: ${unmatchedFiles.length}`)
  console.log(unmatchedFiles.join(', '))

  // Hash unmatched local files
  console.log('\n─'.repeat(60))
  console.log('Step 1: Hashing unmatched local images...\n')

  const localHashes = []
  for (const file of unmatchedFiles) {
    const localPath = path.join(IMAGES_DIR, file)
    process.stdout.write(`  Hashing ${file}... `)
    const hash = await getImageHash(localPath)
    localHashes.push({ file, hash, localPath })
    console.log('✓')
  }

  // Download and hash additional Wix images
  console.log('\n─'.repeat(60))
  console.log('Step 2: Downloading and hashing Wix images...\n')

  const wixHashes = []
  for (const item of additionalWixItems) {
    const wixUrl = `https://static.wixstatic.com/media/${item.mediaUrl}`
    const tempPath = path.join(TEMP_DIR, `wix_${item.itemId}.jpg`)

    process.stdout.write(`  ${item.itemId.substring(0, 8)}... `)

    try {
      if (!fs.existsSync(tempPath)) {
        await downloadImage(wixUrl, tempPath)
      }
      const hash = await getImageHash(tempPath)
      wixHashes.push({ item, hash, tempPath })
      console.log('✓')
    } catch (error) {
      console.log(`✗ (${error.message})`)
      wixHashes.push({ item, hash: null, tempPath: null })
    }

    await new Promise(r => setTimeout(r, 50))
  }

  // Match images
  console.log('\n─'.repeat(60))
  console.log('Step 3: Matching images...\n')

  const newMatches = []
  const usedWixItems = new Set()

  for (const localData of localHashes) {
    if (!localData.hash) continue

    let bestMatch = null
    let bestDistance = Infinity

    for (const wixData of wixHashes) {
      if (usedWixItems.has(wixData.item.itemId)) continue
      if (!wixData.hash) continue

      const distance = hammingDistance(localData.hash, wixData.hash)
      if (distance < bestDistance) {
        bestDistance = distance
        bestMatch = wixData
      }
    }

    if (bestMatch && bestDistance <= 10) {
      usedWixItems.add(bestMatch.item.itemId)
      newMatches.push({
        localFile: localData.file,
        wixItemId: bestMatch.item.itemId,
        wixMediaUrl: bestMatch.item.mediaUrl,
        distance: bestDistance
      })
      console.log(`  ✓ ${localData.file} → Wix item (distance: ${bestDistance})`)
    } else {
      console.log(`  ? ${localData.file} → No match (best: ${bestDistance})`)
    }
  }

  console.log(`\n  Found ${newMatches.length} new matches`)

  // Update existing metadata JSON
  const jsonPath = path.join(DATA_DIR, 'paintings-metadata.json')
  const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  // Update matched paintings with Wix image URLs
  for (const match of newMatches) {
    const orderMatch = match.localFile.match(/(\d+)/)
    const order = orderMatch ? parseInt(orderMatch[1]) : null

    const painting = existingData.paintings.find(p => p.order === order)
    if (painting) {
      painting.wixItemId = match.wixItemId
      painting.wixImageUrl = `https://static.wixstatic.com/media/${match.wixMediaUrl}`
      painting.matchConfidence = match.distance <= 5 ? 'high' : 'medium'
      console.log(`  Updated painting ${order} with Wix URL`)
    }
  }

  // Save updated JSON
  existingData.exportedAt = new Date().toISOString()
  fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2))

  // Cleanup
  console.log('\n  Cleaning up temp files...')
  fs.rmSync(TEMP_DIR, { recursive: true, force: true })

  console.log('\n' + '═'.repeat(60))
  console.log('  Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  New matches found: ${newMatches.length}`)
  console.log(`  JSON updated: ${jsonPath}`)
}

main().catch(console.error)
