import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use public/machines so they are accessible by the app
const machinesDir = '/home/hrsflex/Documents/KGF-GYM/public/machines';
const outputFile = '/home/hrsflex/Documents/KGF-GYM/src/data/machines.json';

const machines = {};

try {
  // Ensure machines directory exists
  if (!fs.existsSync(machinesDir)) {
    console.error(`Machines directory not found: ${machinesDir}`);
    process.exit(1);
  }

  const dirs = fs.readdirSync(machinesDir, { withFileTypes: true });

  dirs.forEach(dirent => {
    if (dirent.isDirectory()) {
      const machineId = dirent.name;
      const machinePath = path.join(machinesDir, machineId);
      
      // Generate human readable name
      const name = machineId.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const files = fs.readdirSync(machinePath);
      const variations = files
        .filter(file => file.endsWith('.mp4'))
        .map(file => path.basename(file, '.mp4'));

      // Generate thumbnail if it doesn't exist
      const thumbnailName = 'thumbnail.jpg';
      const thumbnailPath = path.join(machinePath, thumbnailName);
      const relativeThumbnailPath = `/machines/${machineId}/${thumbnailName}`;
      
      if (!fs.existsSync(thumbnailPath) && variations.length > 0) {
        const firstVideo = variations[0] + '.mp4';
        const videoPath = path.join(machinePath, firstVideo);
        try {
          console.log(`Generating thumbnail for ${machineId}...`);
          // Extract frame at 3 seconds, resize to height 400 (maintain aspect ratio)
          execSync(`ffmpeg -i "${videoPath}" -ss 00:00:03 -vframes 1 -vf "scale=-1:400" "${thumbnailPath}"`, { stdio: 'ignore' });
        } catch (error) {
          console.error(`Failed to generate thumbnail for ${machineId}:`, error.message);
        }
      }

      machines[machineId] = {
        name: name,
        description: `${name} exercises and variations`,
        thumbnail: fs.existsSync(thumbnailPath) ? relativeThumbnailPath : null,
        machines: {
            [machineId]: { 
                name: name,
                description: `Variations for ${name}`,
                variations: variations
            }
        }
      };
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(machines, null, 2));
  console.log(`Successfully generated ${outputFile}`);

} catch (err) {
  console.error('Error generating machines.json:', err);
  process.exit(1);
}
