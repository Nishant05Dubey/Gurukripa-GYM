import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your Vercel domain - Replace with your actual Vercel app URL
const DOMAIN = 'https://gurukripa-fitness.vercel.app';

// Load machines data
const machinesData = JSON.parse(fs.readFileSync('./src/data/machines.json', 'utf8'));

// Ensure output directory exists
const outputDir = path.join(__dirname, 'qr-codes');
const printableDir = path.join(outputDir, 'printable');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(printableDir)) fs.mkdirSync(printableDir, { recursive: true });

async function generateQRCode(url, filename, options = {}) {
  const qrOptions = {
    errorCorrectionLevel: 'M',
    type: 'png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 400,
    ...options
  };

  try {
    await QRCode.toFile(filename, url, qrOptions);
    console.log(`✅ Generated: ${path.basename(filename)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error);
    return false;
  }
}

async function generateAllQRCodes() {
  console.log('🔄 Generating QR codes for KGF Gym machines...\n');
  
  const qrData = [];
  
  for (const [categoryId, category] of Object.entries(machinesData)) {
    console.log(`📁 Processing category: ${category.name}`);
    
    // Create category directory
    const categoryDir = path.join(outputDir, categoryId);
    if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });
    
    for (const [machineId, machine] of Object.entries(category.machines)) {
      const machineUrl = `${DOMAIN}/machine/${categoryId}/${machineId}`;
      const qrFilename = path.join(categoryDir, `${machineId}-qr.png`);
      
      // Generate individual QR code
      const success = await generateQRCode(machineUrl, qrFilename);
      
      if (success) {
        qrData.push({
          category: category.name,
          categoryId,
          machine: machine.name,
          machineId,
          url: machineUrl,
          qrFile: path.relative(outputDir, qrFilename),
          variations: machine.variations || []
        });
      }
    }
    console.log('');
  }
  
  // Generate summary file
  const summaryFile = path.join(outputDir, 'qr-codes-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(qrData, null, 2));
  
  // Generate HTML printable page
  await generatePrintablePage(qrData);
  
  console.log(`🎉 Generated ${qrData.length} QR codes successfully!`);
  console.log(`📁 Files saved in: ${outputDir}`);
  console.log(`🖨️  Printable version: ${path.join(printableDir, 'print-all-qr-codes.html')}`);
  
  return qrData;
}

async function generatePrintablePage(qrData) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GuruKripa Fitness - QR Codes for Printing</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #FF6B35;
            padding-bottom: 20px;
        }
        .gym-title {
            color: #FF6B35;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .subtitle {
            color: #666;
            margin: 5px 0 0 0;
        }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .qr-card {
            border: 2px solid #ddd;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            background: #fafafa;
            page-break-inside: avoid;
        }
        .qr-code {
            width: 200px;
            height: 200px;
            margin: 0 auto 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .machine-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        .category-name {
            font-size: 14px;
            color: #FF6B35;
            margin-bottom: 10px;
        }
        .variations {
            font-size: 12px;
            color: #666;
            margin-top: 10px;
        }
        .url {
            font-size: 10px;
            color: #999;
            word-break: break-all;
            margin-top: 8px;
            padding: 5px;
            background: white;
            border-radius: 4px;
        }
        .instructions {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 40px;
        }
        .instructions h3 {
            color: #0369a1;
            margin-top: 0;
        }
        .print-note {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
        @media print {
            body { margin: 10px; }
            .no-print { display: none; }
            .qr-card { 
                margin-bottom: 20px;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="gym-title">GuruKripa Fitness</h1>
        <p class="subtitle">GuruKripa Fitness - Equipment QR Codes</p>
    </div>

    <div class="instructions no-print">
        <h3>📋 Installation Instructions</h3>
        <ol>
            <li><strong>Print this page</strong> - Use high quality settings for best QR code scanning</li>
            <li><strong>Cut out each QR code</strong> - Leave some border around each code</li>
            <li><strong>Laminate (recommended)</strong> - Protects against moisture and wear</li>
            <li><strong>Attach to equipment</strong> - Place in a visible, easy-to-scan location</li>
        </ol>
        <p><strong>💡 Tip:</strong> Test each QR code with your phone camera before installing!</p>
    </div>

    <div class="qr-grid">
        ${qrData.map(item => `
            <div class="qr-card">
                <img src="../${item.qrFile}" alt="QR Code for ${item.machine}" class="qr-code">
                <div class="machine-name">${item.machine}</div>
                <div class="category-name">${item.category}</div>
                ${item.variations.length > 0 
                    ? `<div class="variations">${item.variations.length} exercise variations available</div>`
                    : `<div class="variations">Exercise videos coming soon</div>`
                }
                <div class="url">${item.url}</div>
            </div>
        `).join('')}
    </div>

    <div class="print-note">
        Generated on ${new Date().toLocaleDateString()} for GuruKripa Fitness Equipment
    </div>
</body>
</html>`;

  const printableFile = path.join(printableDir, 'print-all-qr-codes.html');
  fs.writeFileSync(printableFile, htmlContent);
  console.log('📄 Generated printable HTML page');
}

// Run the generator
generateAllQRCodes().catch(console.error);