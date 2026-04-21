// Simple PWA Icon Creator for KGF Gym
// This creates basic SVG icons that can be converted to PNG

const fs = require('fs');

// Create 192x192 SVG icon
const icon192 = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35"/>
      <stop offset="50%" style="stop-color:#E55D3F"/>
      <stop offset="100%" style="stop-color:#D2524A"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="192" height="192" fill="url(#bg)" rx="24"/>
  
  <!-- Dark overlay for text contrast -->
  <rect width="192" height="192" fill="rgba(0,0,0,0.2)" rx="24"/>
  
  <!-- KGF Text -->
  <text x="96" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="white">GURUKRIPA</text>
  
  <!-- Subtitle -->
  <text x="96" y="115" font-family="Arial, sans-serif" font-size="16" font-weight="normal" 
        text-anchor="middle" fill="white">GYM FITNESS</text>
  
  <!-- Dumbbell Icon -->
  <g stroke="white" stroke-width="4" fill="white" stroke-linecap="round">
    <!-- Barbell bar -->
    <line x1="66" y1="144" x2="126" y2="144"/>
    <!-- Left weight -->
    <circle cx="66" cy="144" r="6"/>
    <!-- Right weight -->
    <circle cx="126" cy="144" r="6"/>
  </g>
</svg>`;

// Create 512x512 SVG icon  
const icon512 = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35"/>
      <stop offset="50%" style="stop-color:#E55D3F"/>
      <stop offset="100%" style="stop-color:#D2524A"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)" rx="64"/>
  
  <!-- Dark overlay for text contrast -->
  <rect width="512" height="512" fill="rgba(0,0,0,0.2)" rx="64"/>
  
  <!-- KGF Text -->
  <text x="256" y="200" font-family="Arial, sans-serif" font-size="128" font-weight="bold" 
        text-anchor="middle" fill="white">GURUKRIPA</text>
  
  <!-- Subtitle -->
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="32" font-weight="normal" 
        text-anchor="middle" fill="white">GYM FITNESS</text>
  
  <!-- Dumbbell Icon -->
  <g stroke="white" stroke-width="10" fill="white" stroke-linecap="round">
    <!-- Barbell bar -->
    <line x1="176" y1="384" x2="336" y2="384"/>
    <!-- Left weight -->
    <circle cx="176" cy="384" r="16"/>
    <!-- Right weight -->
    <circle cx="336" cy="384" r="16"/>
  </g>
</svg>`;

// Write SVG files
fs.writeFileSync('./public/icon-192.svg', icon192);
fs.writeFileSync('./public/icon-512.svg', icon512);

console.log('✅ SVG icons created successfully!');
console.log('📝 To convert to PNG, you can:');
console.log('   1. Open SVGs in browser and screenshot');
console.log('   2. Use online SVG to PNG converter');
console.log('   3. Use imagemagick: convert icon-192.svg icon-192.png');