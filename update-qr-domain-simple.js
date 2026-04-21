import fs from 'fs';
import { execSync } from 'child_process';

// Simple script to update domain and regenerate QR codes
console.log('🔧 KGF Gym QR Code Domain Updater\n');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node update-qr-domain-simple.js YOUR_VERCEL_URL');
  console.log('Example: node update-qr-domain-simple.js https://gurukripa-fitness.vercel.app');
  console.log('\n💡 Find your Vercel URL in your Vercel dashboard or deployment');
  process.exit(1);
}

const domain = args[0];

// Ensure domain starts with https://
let cleanDomain = domain;
if (!cleanDomain.startsWith('http')) {
  cleanDomain = 'https://' + cleanDomain;
}

// Remove trailing slash
cleanDomain = cleanDomain.replace(/\/$/, '');

console.log(`🌐 Updating domain to: ${cleanDomain}`);

// Update the generator script
const generatorFile = 'generate-qr-codes.js';
let content = fs.readFileSync(generatorFile, 'utf8');

const oldDomainRegex = /const DOMAIN = .*/;
const newDomainLine = `const DOMAIN = '${cleanDomain}';`;

content = content.replace(oldDomainRegex, newDomainLine);
fs.writeFileSync(generatorFile, content);

console.log('✅ Updated generator script');

// Regenerate QR codes
console.log('🔄 Regenerating QR codes...\n');
execSync('node generate-qr-codes.js', { stdio: 'inherit' });

console.log('\n🎉 QR codes updated successfully!');
console.log(`📱 Your QR codes now point to: ${cleanDomain}`);
console.log('\n📋 Next steps:');
console.log('1. Check the qr-codes/ folder for updated files');
console.log('2. Print new QR codes from qr-codes/individual-cards/');
console.log('3. Replace old QR codes on your equipment');
console.log('\n💡 Test URL format should be:');
console.log(`   ${cleanDomain}/machine/arm-machine/grip-trainer`);