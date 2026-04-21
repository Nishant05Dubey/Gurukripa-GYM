# Video Assets

This folder contains instructional videos for gym equipment. Videos should be organized by category and named according to the variations defined in `src/data/machines.json`.

## Expected Structure

```
machines/
├── arm-machine/
│   ├── basic-curl.mp4
│   ├── hammer-curl.mp4
│   ├── concentration-curl.mp4
│   ├── overhead-extension.mp4
│   ├── rope-pushdown.mp4
│   └── close-grip.mp4
├── leg-machine/
│   ├── standard-press.mp4
│   ├── wide-stance.mp4
│   ├── narrow-stance.mp4
│   ├── standard-extension.mp4
│   ├── single-leg.mp4
│   └── slow-tempo.mp4
└── cardio-machine/
    ├── basic-walk.mp4
    ├── interval-run.mp4
    ├── incline-walk.mp4
    ├── standard-pace.mp4
    ├── high-intensity.mp4
    └── reverse-motion.mp4
```

## Video Requirements

- **Format**: MP4 (H.264 encoding recommended)
- **Resolution**: 720p minimum, 1080p preferred
- **Duration**: 30-120 seconds per variation
- **Quality**: Clear demonstration of proper form
- **Audio**: Optional but helpful for instruction

## Adding New Videos

1. Record exercise demonstration
2. Name file exactly as defined in machines.json variations array
3. Place in appropriate category folder
4. Test QR code generation for the machine