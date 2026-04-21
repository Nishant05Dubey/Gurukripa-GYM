import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Domain Update Tool for KGF Gym QR Codes\n');

rl.question('Enter your Vercel app URL (e.g., https://gurukripa-fitness.vercel.app): ', (domain) => {
  if (!domain.startsWith('http')) {
    domain = 'https://' + domain;
  }
  
  // Remove trailing slash if present
  domain = domain.replace(/\/$/, '');
  
  // Update the generator script
  const generatorFile = 'generate-qr-codes.js';
  let content = fs.readFileSync(generatorFile, 'utf8');
  
  const oldDomainRegex = /const DOMAIN = .*/;
  const newDomainLine = `const DOMAIN = '${domain}';`;
  
  content = content.replace(oldDomainRegex, newDomainLine);
  fs.writeFileSync(generatorFile, content);
  
  console.log(`✅ Updated domain to: ${domain}`);
  console.log('\nNow generating QR codes with your domain...\n');
  
  rl.close();
  
  // Import and run the generator
  import('./generate-qr-codes.js');
});