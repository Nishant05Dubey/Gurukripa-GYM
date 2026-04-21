import fs from 'fs';

console.log('🔧 Fixing QR Code Domain...\n');

// Replace this with your actual Vercel domain
const YOUR_ACTUAL_DOMAIN = 'https://YOUR_ACTUAL_VERCEL_URL.vercel.app';

console.log('⚠️  IMPORTANT: Please update YOUR_ACTUAL_DOMAIN in this script with your real Vercel URL');
console.log('Example: https://kgf-gym-equipment-guide.vercel.app\n');

// Update the generator script
const generatorFile = 'generate-qr-codes.js';
let content = fs.readFileSync(generatorFile, 'utf8');

// Fix the domain line
const oldDomainRegex = /const DOMAIN = .*/;
const newDomainLine = `const DOMAIN = '${YOUR_ACTUAL_DOMAIN}';`;

content = content.replace(oldDomainRegex, newDomainLine);
fs.writeFileSync(generatorFile, content);

console.log(`✅ Updated domain to: ${YOUR_ACTUAL_DOMAIN}`);
console.log('\n📋 Next steps:');
console.log('1. Edit fix-qr-domain.js and replace YOUR_ACTUAL_VERCEL_URL with your real domain');
console.log('2. Run: node fix-qr-domain.js');
console.log('3. Run: npm run generate-qr');
console.log('\n💡 Your QR codes should generate URLs like:');
console.log('   https://your-app.vercel.app/machine/arm-machine/grip-trainer');
console.log('   (NOT with /scan/ in the middle)');