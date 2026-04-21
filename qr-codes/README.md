# KGF Gym - QR Codes for Equipment

This folder contains all the QR codes generated for your gym equipment, ready for printing and installation.

## 📁 Folder Structure

```
qr-codes/
├── arm-machine/
│   └── grip-trainer-qr.png
├── back-machine-rowing/
│   └── rowing-machine-qr.png
├── individual-cards/
│   ├── grip-trainer-card.html
│   └── rowing-machine-card.html
├── printable/
│   └── print-all-qr-codes.html
└── qr-codes-summary.json
```

## 🖨️ Printing Options

### Option 1: Individual Cards (Recommended)
- Open files in `individual-cards/` folder
- Each HTML file contains a beautifully designed card for one machine
- Print on cardstock for durability
- Cut out and laminate for water resistance

### Option 2: All-in-One Page  
- Open `printable/print-all-qr-codes.html`
- Contains all QR codes on one page
- Good for bulk printing and cutting

## 🎯 QR Code URLs

Your QR codes point to these URLs on your Vercel app:

| Equipment | QR Code URL | Videos Available |
|-----------|-------------|------------------|
| **Grip and Wrist Trainer** | `/machine/arm-machine/grip-trainer` | ✅ 4 videos |
| **Rowing Machine** | `/machine/back-machine-rowing/rowing-machine` | ⏳ Coming soon |

## 📋 Installation Instructions

1. **Print Quality**: Use high-quality settings (300+ DPI) for clear QR codes
2. **Material**: Print on waterproof/laminated material for gym environment  
3. **Size**: QR codes are 400x400px - suitable for 3-4 inch squares
4. **Placement**: Mount in visible, easily accessible locations on equipment
5. **Height**: Place at eye level (4-5 feet) for easy scanning

## 🔄 Regenerating QR Codes

If you need to regenerate QR codes (e.g., after domain change):

```bash
# Update your domain in generate-qr-codes.js
npm run generate-qr

# Or run directly
node generate-qr-codes.js
```

## 📱 Testing QR Codes

Before installation:
1. Print a test page
2. Scan each QR code with your phone camera
3. Verify it opens the correct machine page
4. Test video playback

## 🚀 Next Steps

1. **Print cards** using individual-cards HTML files
2. **Laminate** for durability in gym environment  
3. **Install** on corresponding equipment
4. **Train staff** on how the system works
5. **Monitor usage** and add more videos as needed

## 💡 Tips

- **QR Code Size**: Minimum 2x2 inches for reliable scanning
- **Contrast**: Ensure good contrast between QR code and background
- **Lighting**: Install in well-lit areas
- **Protection**: Consider weatherproof cases for high-moisture areas
- **Backup**: Keep digital copies of QR codes for reprinting

Need to add more equipment? Update `src/data/machines.json` and run the generator again!