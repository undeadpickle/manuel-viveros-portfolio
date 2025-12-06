import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/images/paintings');
const OUTPUT_DIR = path.join(INPUT_DIR, 'optimized');
const MAX_DIMENSION = 2500;
const JPEG_QUALITY = 85;
const CONCURRENCY = 4;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(inputPath) {
  try {
    const filename = path.basename(inputPath);
    const ext = path.extname(filename).toLowerCase();
    const nameWithoutExt = path.basename(filename, ext);

    // Read input image metadata
    const metadata = await sharp(inputPath).metadata();

    // Calculate new dimensions maintaining aspect ratio
    let width = metadata.width;
    let height = metadata.height;
    let resized = false;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      resized = true;
    }

    // Always convert to JPG for better compression with paintings
    const outputPath = path.join(OUTPUT_DIR, `${nameWithoutExt}.jpg`);

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true,
        progressive: true
      })
      .toFile(outputPath);

    // Get file size info
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);
    const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
    const resizeInfo = resized ? ` (resized to ${width}x${height})` : '';

    console.log(`${filename}: ${inputSizeMB}MB -> ${outputSizeMB}MB (${reduction}% reduction)${resizeInfo}`);

    return { success: true, inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return { success: false };
  }
}

async function processBatch() {
  const files = fs.readdirSync(INPUT_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => path.join(INPUT_DIR, file));

  console.log(`\nOptimizing ${files.length} images...`);
  console.log(`Settings: max ${MAX_DIMENSION}px, ${JPEG_QUALITY}% quality, MozJPEG\n`);
  console.log('─'.repeat(70));

  let totalInputSize = 0;
  let totalOutputSize = 0;
  let successCount = 0;

  // Process with concurrency limit
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(optimizeImage));

    results.forEach(result => {
      if (result.success) {
        successCount++;
        totalInputSize += result.inputSize;
        totalOutputSize += result.outputSize;
      }
    });
  }

  const totalReduction = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);

  console.log('─'.repeat(70));
  console.log(`\nComplete! Processed ${successCount}/${files.length} images`);
  console.log(`Total: ${(totalInputSize / 1024 / 1024).toFixed(2)}MB -> ${(totalOutputSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Overall reduction: ${totalReduction}%`);
  console.log(`\nOutput: ${OUTPUT_DIR}`);
}

processBatch().catch(console.error);
