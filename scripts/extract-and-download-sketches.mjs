import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// All 444 sketches extracted from Wix gallery (no metadata - just images)
const wixSketches = [
  {order:1,itemId:"70bfeac5-a105-4d74-9c15-109f1fa00c02",mediaUrl:"a7c938_f0086d0338bc42798d85dde30b1dbb0d~mv2.jpg"},
  {order:2,itemId:"7cb6b1c9-d9c0-4910-aace-c86d24096594",mediaUrl:"a7c938_b975852f253e4f76a0fca0478fc9414c~mv2.jpg"},
  {order:3,itemId:"2429016a-aab1-44ce-960d-6bf797b43506",mediaUrl:"a7c938_7fca2fe491b842d7b4c9da0299ae144c~mv2.jpg"},
  {order:4,itemId:"4caeab1a-6f18-4db4-afd4-3392f8f5ad19",mediaUrl:"a7c938_dc274b1dd4a845789b2b860f28be746f~mv2.jpg"},
  {order:5,itemId:"04df2454-c40e-41aa-897c-e872195f45fd",mediaUrl:"a7c938_dbf1803deaa24452b756ad4468996648~mv2.jpg"},
  {order:6,itemId:"ffc3f0d2-aa9d-4457-8611-0e00be483911",mediaUrl:"a7c938_33f565e8adf343d0872bee3b526b8410~mv2.jpg"},
  {order:7,itemId:"1afc386f-23b1-4ce6-90e1-a0a542205ae3",mediaUrl:"a7c938_83249c15989f4e838ecabcb6a304c418~mv2.jpg"},
  {order:8,itemId:"ca7510f9-229f-4db6-8d77-4a915aed9555",mediaUrl:"a7c938_f903ccaf1665464fba009291403c3840~mv2.jpg"},
  {order:9,itemId:"1f34283f-1caf-404a-825d-6ac4e6a19885",mediaUrl:"a7c938_d3cd61f3a5fb4488986141fdc75981c3~mv2.jpg"},
  {order:10,itemId:"489bd3c8-32ae-419a-b342-fbaf19bd331d",mediaUrl:"a7c938_8c01e5fe837b4933bfb25df876426c08~mv2.png"},
  {order:11,itemId:"eb0cd5a1-a491-4454-a911-23c38a534b32",mediaUrl:"a7c938_a4381f90632e4d2ebce705a75befc9f1~mv2.jpg"},
  {order:12,itemId:"dd706323-0076-43d9-bbc4-9c0bcdaf92b3",mediaUrl:"a7c938_d5b615e2a08849bb899f9cb9291eb84d~mv2.jpg"},
  {order:13,itemId:"f6b4e49b-13ae-4d66-9dc4-aba1c5f39ae1",mediaUrl:"a7c938_2dbff97ce0654825a9b3e696dc8551cb~mv2.jpg"},
  {order:14,itemId:"2f4d4f6c-549b-4523-bfd0-ab73169515ba",mediaUrl:"a7c938_7d29751f4bee46a9b1ff732a5a15882f~mv2.jpg"},
  {order:15,itemId:"0c69b085-cd17-4685-afc0-614cfc33de6b",mediaUrl:"a7c938_987e5b8d3a2e444aa2097113ddd5ca35~mv2.jpg"},
  {order:16,itemId:"fa374045-6317-4d12-bc86-1624b0f5e24f",mediaUrl:"a7c938_f646080c22ae45b7bf2677eefb141058~mv2.jpg"},
  {order:17,itemId:"6afd7d0f-c7d1-4b32-a67c-6fa4f57d3d31",mediaUrl:"a7c938_f4e1591b828d4062ab938027c7e8c910~mv2.jpg"},
  {order:18,itemId:"3cedbcc2-a92e-45e6-826d-a6db1ba14569",mediaUrl:"a7c938_5836db7daff3436d9dfa4cd30c8433c1~mv2.jpg"},
  {order:19,itemId:"2da73448-7d96-4988-9c45-a3109ea435c7",mediaUrl:"a7c938_c30423c20b894355845d63061751065e~mv2.jpg"},
  {order:20,itemId:"56671392-51e3-4a99-8e54-377fb932de65",mediaUrl:"a7c938_6fd1e068362942d593c9727bc7a53261~mv2.jpg"},
  {order:21,itemId:"4a5d0d42-dd0a-403c-b47d-52ec1f8cdf0d",mediaUrl:"a7c938_09365c8496624de793bef765e81a7796~mv2.jpg"},
  {order:22,itemId:"090dcf5a-9903-41d6-a870-e375ef5efd66",mediaUrl:"a7c938_4411b021d13e4bc69e0dc381903ca50a~mv2.jpg"},
  {order:23,itemId:"ddcb9075-a89b-478b-bbe9-5d5140839843",mediaUrl:"a7c938_8f266efd88a2429ca9c62810d3c1ae9c~mv2.jpg"},
  {order:24,itemId:"90abd24f-4ba2-47e6-b9f9-6b943681b344",mediaUrl:"a7c938_e2de8c60e2f04b9f9a5e4827f5242747~mv2.jpg"},
  {order:25,itemId:"2e8efce5-c4e9-417c-96ae-f21aaaebeed3",mediaUrl:"a7c938_f9776e54ab264af0b031fbf043d26da1~mv2.jpg"},
  {order:26,itemId:"eee49640-00e9-4ff0-88c9-212ccf49e509",mediaUrl:"a7c938_779d126bf22347749aed4100dd1014be~mv2.jpg"},
  {order:27,itemId:"ed83a6cc-c050-4db0-9e49-0b1b6c344038",mediaUrl:"a7c938_2c79ba620807467e8a6f329f4129ed44~mv2.jpg"},
  {order:28,itemId:"9c970751-ae65-463f-a2a6-e7e20922341c",mediaUrl:"a7c938_5a86fdce0f6e43139472386622cac225~mv2.jpg"},
  {order:29,itemId:"4341a7f0-3351-4c4c-857e-be09a65a8aba",mediaUrl:"a7c938_05bca230e0e84013a5ef517ea22b7bb1~mv2.jpg"},
  {order:30,itemId:"0550adff-4eda-4778-9867-4651bd4f49db",mediaUrl:"a7c938_f963ed565bfb40bbaf66289fbdde417c~mv2.jpg"},
  {order:31,itemId:"cb19318c-4959-4d4c-9640-21c27e661cf2",mediaUrl:"a7c938_9b8b4bb9b16948df8f7608b02836b9a8~mv2.jpg"},
  {order:32,itemId:"a2a9eca2-47c9-4b94-a978-137ab80d7b06",mediaUrl:"a7c938_301df39523924ec8a32465adb1b4d1ed~mv2.jpg"},
  {order:33,itemId:"357aa404-a95f-40aa-bb88-0fe420288c56",mediaUrl:"a7c938_949809b84c8c4c70b6b685ae6a248901~mv2.jpg"},
  {order:34,itemId:"d4da0eb2-4222-4d11-a23a-d3a182e8a127",mediaUrl:"a7c938_85f175a435704a6f8cc78f2a9d3a8ad8~mv2.jpg"},
  {order:35,itemId:"eb3e85a3-4804-4c8c-9745-965fdab71a11",mediaUrl:"a7c938_260d666aaacd47b9b7ff0963f1e03914~mv2.jpg"},
  {order:36,itemId:"169ce8a9-ab79-45df-961a-0a7c71c2d59d",mediaUrl:"a7c938_80eb70d965c64a43be1e1950f948029a~mv2.jpg"},
  {order:37,itemId:"217b5a54-0dfb-42ee-8107-a839c5480476",mediaUrl:"a7c938_df281ed04c454850a272b1f10f2cff26~mv2.png"},
  {order:38,itemId:"b1cb52ed-f22e-4a26-ba6a-1f9fed1db3e1",mediaUrl:"a7c938_37d293c08e474581bfdb99d281e1ddd2~mv2.png"},
  {order:39,itemId:"a9f6d522-1fea-4b97-874d-f5e3b0acd485",mediaUrl:"a7c938_01afa9a6dfc249159f4a60938d401e91~mv2.png"},
  {order:40,itemId:"be13350b-7012-465f-8515-ba103849871b",mediaUrl:"a7c938_7f2514049aee4375b610f2d618dc0ad2~mv2.png"},
  {order:41,itemId:"2d77cb95-ecf3-4882-a4a2-c2f899fd790f",mediaUrl:"a7c938_e2468175400d4ade94ee73fde733e64e~mv2.png"},
  {order:42,itemId:"89da6f57-7594-4410-bbb2-4385fcb3508f",mediaUrl:"a7c938_555eaef089af483a9377a555c78e5a4b~mv2.png"},
  {order:43,itemId:"644011d5-e862-45b5-9fa3-010544a939c4",mediaUrl:"a7c938_e5a4d3b93a21455eb62dfe8818cd0137~mv2.jpg"},
  {order:44,itemId:"85c910d2-ffc0-4af2-9521-cfdd8fcbd891",mediaUrl:"a7c938_af464bdddc9f49409005ec1261173fb2~mv2.jpg"},
  {order:45,itemId:"2c8a2295-a5ff-48ae-b6a7-e0e18b65038b",mediaUrl:"a7c938_19a756cc9cb74ece9c673e1c81d86276~mv2.png"},
  {order:46,itemId:"d88e1fe1-0a2b-47f4-b7a9-059e450bc687",mediaUrl:"a7c938_2515440a5a954883916c45f99d5321fc~mv2.jpg"},
  {order:47,itemId:"a9c4e0d9-b10d-4864-9dac-77c4e4504857",mediaUrl:"a7c938_49398be331024eb789f1710ced79f4f6~mv2.jpg"},
  {order:48,itemId:"62a9547e-5838-4a38-976d-f066f2db3ec2",mediaUrl:"a7c938_caa4387817934f01a442112b97daf270~mv2.jpg"},
  {order:49,itemId:"ecc41f9a-85a0-4775-974b-8f61ccc65fe8",mediaUrl:"a7c938_a44a44d7a2534247b8ec26de2e51ec5a~mv2.png"},
  {order:50,itemId:"d4c8ad46-bf93-47de-a7be-3e04fac44fc3",mediaUrl:"a7c938_a25e8dc9d381448e86ec0c1d01049f7c~mv2.png"},
  {order:51,itemId:"2a90cd45-b785-4617-849d-807409bbcd46",mediaUrl:"a7c938_e4ed4f1fe72240da92a0880e3bdbf55b~mv2.png"},
  {order:52,itemId:"181c3d96-b283-41d1-9888-ba1842057be9",mediaUrl:"a7c938_c668b2c127d54d38a9ea0f7ff870bdc1~mv2.png"},
  {order:53,itemId:"4595518f-beff-43ec-b36e-136980b18f9b",mediaUrl:"a7c938_032d6f90b1ec4882a534292eff70e968~mv2.png"},
  {order:54,itemId:"478341c3-a37a-4d0b-893f-2833c186c4b6",mediaUrl:"a7c938_ce6c32b6f2174a8aa1bbd146b45fbf58~mv2.png"},
  {order:55,itemId:"72cfc35c-f1c3-46dc-a5bc-0adfeef9fa8e",mediaUrl:"a7c938_f1e1e908221f46ca9ca6fe34605393ed~mv2.jpg"},
  {order:56,itemId:"77d21959-271e-41bc-b7c2-adfd27bba913",mediaUrl:"a7c938_7849c53591844031be302692495df43d~mv2.png"},
  {order:57,itemId:"f229d05b-8490-4a3b-b174-7a1eaedf1476",mediaUrl:"a7c938_e6e0b04262b446c88522ebaaf4c7e1df~mv2.png"},
  {order:58,itemId:"fc45f619-1883-4237-a4fd-2b03ff95799e",mediaUrl:"a7c938_87346deeec174d02ac91047c7b9ed8f0~mv2.png"},
  {order:59,itemId:"99554a30-b600-4bb5-982f-7a12ac11e812",mediaUrl:"a7c938_e0d76ce6557448bb8a56ba3b42d3061c~mv2.jpeg"},
  {order:60,itemId:"91e63f97-3c42-461a-90fb-d93401ff4718",mediaUrl:"a7c938_b37a1a4bbd6e4330b6cd78f6127cdff6~mv2.jpeg"},
  {order:61,itemId:"d5f62390-69db-423f-8a6a-aaa82474ddb5",mediaUrl:"a7c938_cf2945dd04fa4cfaac9ec8df969361a6~mv2.jpeg"},
  {order:62,itemId:"30a2e595-6dd1-4e8d-adc6-fd507018e640",mediaUrl:"a7c938_4873cd75b62042f8b920c855d00d5409~mv2.jpeg"},
  {order:63,itemId:"fac4deaa-6baf-410a-b9fa-33bde541749e",mediaUrl:"a7c938_7f4bb535a61a404e8ce5b0206dc0b5f9~mv2.jpeg"},
  {order:64,itemId:"b573a631-621e-4444-9d6e-b056416a5817",mediaUrl:"a7c938_e33d72fdbb1344259a95a1035145a87f~mv2.jpeg"},
  {order:65,itemId:"9cb87107-2f47-4813-a18a-dd8de3900953",mediaUrl:"a7c938_124e7cbaedcc45ecb9d5ecce2a92eed0~mv2.jpeg"},
  {order:66,itemId:"94c42798-1a3a-4904-925a-2a2572da3788",mediaUrl:"a7c938_e57b737cc54c4268b51f8d5211ab6b32~mv2.jpeg"},
  {order:67,itemId:"0631f59b-1f09-40f5-8a5e-fef18ddb1fc6",mediaUrl:"a7c938_26b4fb7c2e09493cb8603218e7579b9a~mv2.jpeg"},
  {order:68,itemId:"c9a006af-81cb-46de-ba89-6da5e33d4f5a",mediaUrl:"a7c938_fa2d8726b1964bc0a465d9a8bda0020b~mv2.jpg"},
  {order:69,itemId:"5b5552ef-8c3d-4747-92cd-3b2cf1787910",mediaUrl:"a7c938_e9793029f9984077b48cf76f488ed5a1~mv2.jpeg"},
  {order:70,itemId:"e931ab57-40cd-4568-905c-1ac56353b705",mediaUrl:"a7c938_ddebf95ea98a4dda90ef64eab0cf8a4e~mv2.jpeg"},
  {order:71,itemId:"bf0e80b9-d36b-4dde-aa03-a3652c2dca0a",mediaUrl:"a7c938_3ae63d4503cc49249b6853af6e764bf4~mv2.jpeg"},
  {order:72,itemId:"1ab88ef1-d056-4470-a978-83e3bfe5b906",mediaUrl:"a7c938_43aeda74c96449a4976ec771e114e10a~mv2.jpg"},
  {order:73,itemId:"23bf38b3-3b90-48c1-b656-19cedbdd86e1",mediaUrl:"a7c938_9a2a77684a74495aa4649dfe893f8202~mv2.jpeg"},
  {order:74,itemId:"f2549ac4-f797-4012-9f7c-150744bb8f42",mediaUrl:"a7c938_493d1390686b483cb9992a578ad85d41~mv2.png"},
  {order:75,itemId:"f8ef2ae2-3c39-407f-b29a-17bd52488763",mediaUrl:"a7c938_ade40a05777249c79f2d6768a103d8b8~mv2.jpg"},
  {order:76,itemId:"96befb0f-0352-46ea-a840-d87c15df949c",mediaUrl:"a7c938_8bc77b9401704bb0b0963cbd2412f417~mv2.jpg"},
  {order:77,itemId:"b675e3ad-072b-4c6d-8d66-55fa26f24c11",mediaUrl:"a7c938_1e2c5709a69d4a01b65e4544b9553659~mv2.jpg"},
  {order:78,itemId:"d97ff32e-f3c1-46de-9ef3-90ba5cbf2b23",mediaUrl:"a7c938_d6da14972a5a4e0fb63a5dcac62f2965~mv2.jpg"},
  {order:79,itemId:"d62f32e5-e1d7-4776-b735-5a2f98241210",mediaUrl:"a7c938_a402bb55f97244ef9a21700b24707103~mv2.jpg"},
  {order:80,itemId:"1d6431c2-3c32-45db-9292-ea6ef995e666",mediaUrl:"a7c938_e6602937bbff4901b602d4b7cb6e7bc1~mv2.png"},
  {order:81,itemId:"04ed5b25-d3ee-477b-80c3-c7948f7d079c",mediaUrl:"a7c938_d9b106fc31724eea88ed69b1bebfa4df~mv2.png"},
  {order:82,itemId:"26ca33ba-b7a9-40f4-9e5b-ae059c155544",mediaUrl:"a7c938_0ceea7e9c31a40d8a54c040846ffafae~mv2.jpg"},
  {order:83,itemId:"d5ecf843-6b3b-4a3a-8cc3-c0a44a620c26",mediaUrl:"a7c938_af1e78ef74e34a6fb6e9ad63a82f1cab~mv2.jpg"},
  {order:84,itemId:"20531612-ea1e-4253-96f0-782d7b1f7d2c",mediaUrl:"a7c938_c5118dc7a70044629dd453ea1e6abe46~mv2.png"},
  {order:85,itemId:"b7ac54a8-23f1-493f-b1d3-46d47270d43c",mediaUrl:"a7c938_d4b57b192ce0448a94c5e5cbd8d67874~mv2.jpg"},
  {order:86,itemId:"9b1093ea-e725-43c0-9581-c6ec2d603134",mediaUrl:"a7c938_a6cb5be1d2a14ef08ead76f6c097afe7~mv2.jpg"},
  {order:87,itemId:"a8ace0f2-10eb-49c2-beb2-eb2bb5c715c4",mediaUrl:"a7c938_7e50429a255449cb95fea9839eb2aa6a~mv2.jpg"},
  {order:88,itemId:"c066df12-06e1-48e8-9105-f54d3c06bbba",mediaUrl:"a7c938_a4a2e973edef4820a304edaa444d51ba~mv2.jpg"},
  {order:89,itemId:"6a2dff29-1bb4-4a98-9f28-7faf3fa90372",mediaUrl:"a7c938_08bedd76b2e447228381fb7efa1213d1~mv2.jpg"},
  {order:90,itemId:"565315b0-b919-4fee-9ca4-0796c3a748fa",mediaUrl:"a7c938_bddfe1e4c36c458193fbfabe104ea1e0~mv2.png"},
  {order:91,itemId:"9621fd65-1d43-4dac-a40a-51ed8634db00",mediaUrl:"a7c938_bc378ca451a44ea2ae7de51355ce9649~mv2.jpg"},
  {order:92,itemId:"ac5e14ff-11a7-42fc-9f3a-eabca10c65f5",mediaUrl:"a7c938_6e1ec48383a647b9a819729cba3140c0~mv2.jpg"},
  {order:93,itemId:"0de12682-a3bf-45db-b3aa-55251238bd5f",mediaUrl:"a7c938_445a81ca211e437ea981115c33c8ca17~mv2.jpg"},
  {order:94,itemId:"71606d14-afff-4fef-9d47-72489921a098",mediaUrl:"a7c938_a4046bf4f95d45b7b4356fd9f037b244~mv2.jpg"},
  {order:95,itemId:"8944d67f-267a-4d8a-b38e-98c3c9d3ba22",mediaUrl:"a7c938_32d9e72eacdc483385cb01b1392ec6e2~mv2.jpg"},
  {order:96,itemId:"e412ab97-38a0-486b-9fa8-fdd54456a626",mediaUrl:"a7c938_ceb27d3280534383b409e0f0df18aee8~mv2.jpg"},
  {order:97,itemId:"0779ba4b-c9c6-472b-91f9-ac0baecf7bbe",mediaUrl:"a7c938_e8d02a5d587f4ad6b080c4a1c01cf7c4~mv2.jpg"},
  {order:98,itemId:"bf0b0eb8-2335-4bfe-a609-52f46be8d746",mediaUrl:"a7c938_c3391936a0db4230b69aae3bf4d3e16f~mv2.jpg"},
  {order:99,itemId:"5ee6150f-3312-4890-bdcd-c59a3c97e984",mediaUrl:"a7c938_38c3f0f77a11419787f0e1b32fd62cb1~mv2.jpg"},
  {order:100,itemId:"d05dfb85-dd74-4079-8ade-3145a2e5663a",mediaUrl:"a7c938_a3c110c0c39a48e1a0cfe40a0d5a5a5f~mv2.jpg"},
]

// Due to the large number of sketches (444), we'll load the rest from a JSON file
// This script will first save the full data, then download

// Configuration - paths as constants at top of file
const OUTPUT_DIR = path.join(__dirname, '../public/images/sketches/original')
const DATA_FILE = path.join(__dirname, '../data/sketches-wix-data.json')

// CLI arguments for batch processing
const args = process.argv.slice(2)
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1], 10) : null
}
const LIMIT = getArg('limit')   // e.g., --limit 25
const OFFSET = getArg('offset') || 0  // e.g., --offset 25

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        fs.unlinkSync(filepath)
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject)
        return
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Extract and Download Sketches from Wix')
  console.log('═'.repeat(60))

  // Check if we have the full data file
  let allSketches = wixSketches

  if (fs.existsSync(DATA_FILE)) {
    console.log('\nLoading existing sketch data...')
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    allSketches = data.sketches
    console.log(`Loaded ${allSketches.length} sketches from ${DATA_FILE}`)
  } else {
    console.log('\nNo existing data file. Using embedded data (first 100 sketches).')
    console.log('Run the full extraction from browser first to get all 444 sketches.')
  }

  // Apply offset and limit for batch processing
  const totalSketches = allSketches.length
  const sketches = allSketches.slice(OFFSET, LIMIT ? OFFSET + LIMIT : undefined)

  console.log(`\nOutput:  ${OUTPUT_DIR}`)
  console.log(`Total:   ${totalSketches} sketches available`)
  if (LIMIT || OFFSET) {
    console.log(`Batch:   Processing ${sketches.length} sketches (offset: ${OFFSET}, limit: ${LIMIT || 'none'})`)
  }
  console.log('─'.repeat(60))

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let successCount = 0
  let skipCount = 0
  let failCount = 0

  for (let i = 0; i < sketches.length; i++) {
    const sketch = sketches[i]
    const paddedOrder = sketch.order.toString().padStart(3, '0')
    const ext = sketch.mediaUrl.includes('.png') ? 'png' :
                sketch.mediaUrl.includes('.jpeg') ? 'jpg' : 'jpg'
    const filename = `sketch_${paddedOrder}.${ext}`
    const filepath = path.join(OUTPUT_DIR, filename)
    const progress = `[${i + 1}/${sketches.length}]`

    // Check if already downloaded
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath)
      if (stats.size > 10000) {
        console.log(`${progress} ✓ Already exists: ${filename}`)
        skipCount++
        continue
      }
    }

    // Build Wix CDN URL for full resolution
    const imageUrl = `https://static.wixstatic.com/media/${sketch.mediaUrl}`

    try {
      console.log(`${progress} Downloading: ${filename}...`)
      await downloadImage(imageUrl, filepath)

      const stats = fs.statSync(filepath)
      console.log(`  ✓ Downloaded: ${(stats.size / 1024).toFixed(1)} KB`)
      successCount++
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`)
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Save the data
  const dataDir = path.join(__dirname, '../data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Prepare sketch metadata for Sanity upload (always save ALL sketches, not just the batch)
  const sketchData = allSketches.map(s => ({
    order: s.order,
    itemId: s.itemId,
    mediaUrl: s.mediaUrl,
    title: s.title || { en: `Sketch ${s.order.toString().padStart(3, '0')}`, es: `Boceto ${s.order.toString().padStart(3, '0')}` },
    medium: s.medium || { en: 'Mixed media', es: 'Técnica mixta' }
  }))

  fs.writeFileSync(DATA_FILE, JSON.stringify({
    exportedAt: new Date().toISOString(),
    source: 'https://manuel-viveros.wixsite.com/manuelviveros/sketches',
    totalCount: allSketches.length,
    sketches: sketchData
  }, null, 2))

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('  Download Complete!')
  console.log('═'.repeat(60))
  console.log(`\n  ✓ Downloaded: ${successCount}`)
  console.log(`  ○ Skipped:    ${skipCount}`)
  console.log(`  ✗ Failed:     ${failCount}`)
  console.log(`  Total:        ${sketches.length}`)
  console.log(`\n  Data saved:   ${DATA_FILE}`)
  console.log('\n✓ Done! Run optimize-sketches.mjs next.')
}

main().catch(console.error)
