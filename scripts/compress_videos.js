import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const machinesDir = path.join(__dirname, '../public/machines');

if (!fs.existsSync(machinesDir)) {
  console.error(`Machines directory not found: ${machinesDir}`);
  process.exit(1);
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024 / 1024).toFixed(2); // MB
}

function compressVideo(filePath) {
  const tempPath = filePath + '.temp.mp4';
  const originalSize = getFileSize(filePath);
  
  console.log(`Compressing ${path.basename(filePath)} (${originalSize} MB)...`);

  try {
    // CRF 28 is a good balance for web video (lower is better quality, higher is smaller size)
    // -movflags +faststart moves metadata to front for faster playback start
    // -vf scale=-2:720 resizes to 720p height, keeping aspect ratio
    execSync(`ffmpeg -i "${filePath}" -vcodec libx264 -crf 28 -preset medium -vf "scale=-2:720" -acodec aac -b:a 128k -movflags +faststart "${tempPath}"`, { stdio: 'inherit' });
    
    const newSize = getFileSize(tempPath);
    console.log(`Compressed: ${newSize} MB (was ${originalSize} MB)`);

    if (parseFloat(newSize) < parseFloat(originalSize)) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`Updated ${path.basename(filePath)}`);
    } else {
        console.log(`Compression didn't save space, keeping original.`);
        fs.unlinkSync(tempPath);
    }

  } catch (error) {
    console.error(`Failed to compress ${filePath}:`, error.message);
    if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
    }
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  files.forEach(dirent => {
    const fullPath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      processDirectory(fullPath);
    } else if (dirent.isFile() && dirent.name.endsWith('.mp4')) {
      compressVideo(fullPath);
    }
  });
}

console.log('Starting video compression...');
processDirectory(machinesDir);
console.log('All videos processed.');
