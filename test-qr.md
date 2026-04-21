# QR Code Testing

## Test URLs for your KGF Gym app

Based on your video structure, here are the URLs that QR codes should generate:

### Arm Machine - Grip Trainer
- **Base URL**: `/machine/arm-machine/grip-trainer`
- **QR Code Content**: `https://yourdomain.com/machine/arm-machine/grip-trainer`

This will show:
- ✅ FingerGripping.mp4
- ✅ WristCurl.mp4  
- ✅ twistFolding.mp4
- ✅ OneArmWrestling.mp4

### Back Machine - Rowing
- **Base URL**: `/machine/back-machine-rowing/rowing-machine`  
- **QR Code Content**: `https://yourdomain.com/machine/back-machine-rowing/rowing-machine`

This will show:
- ⚠️ "Coming Soon" message (no videos yet)

## How to Generate QR Codes

1. Use any QR code generator (qr-code-generator.com, etc.)
2. Enter the full URL including your domain
3. Print and attach to the corresponding gym equipment

## Testing Locally

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/machine/arm-machine/grip-trainer` (Note: In production this will be `https://gurukripa-fitness.vercel.app/machine/arm-machine/grip-trainer`)
3. Test video playback and variation selection