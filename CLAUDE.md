# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KGF Gym Equipment Guide is a mobile-friendly React PWA that allows gym users to scan QR codes on machines to access instructional videos. Users can view exercise variations and learn proper form through video demonstrations.

## Development Commands

- `npm install` - Install project dependencies
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle with PWA support  
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks
- `npm run generate-qr` - Generate QR codes for all machines
- `npm run update-qr-domain` - Update domain and regenerate QR codes

## Architecture

**Frontend Stack**: React 18 + Vite + Tailwind CSS + React Router
**PWA**: Vite PWA plugin with Workbox for offline caching
**QR Scanning**: qr-scanner library for camera access
**Video Management**: File-based organization matching JSON data structure

**Key Components**:
- `QRScanner.jsx` - Camera-based QR code scanning with error handling
- `VideoPlayer.jsx` - Custom HTML5 video player with variation selection
- `pages/Home.jsx` - Main dashboard with equipment categories  
- `pages/MachineDetail.jsx` - Video playback and exercise information
- `data/machines.json` - Equipment catalog and video mapping

**Routing Structure**:
- `/` - Home page with equipment browsing
- `/scan` - QR code scanning interface
- `/category/{categoryId}` - Browse all machines in a category
- `/machine/{category}/{machineName}` - Machine detail with video

## Video Content Management

Videos must be placed in `src/assets/videos/machines/{category}/{variation}.mp4` following the exact naming from `machines.json`. The app expects this structure:

```
src/assets/videos/machines/
├── arm-machine/
├── leg-machine/ 
└── cardio-machine/
```

To add new equipment:
1. Update `src/data/machines.json` with machine info and variations
2. Add corresponding video files using variation names as filenames
3. QR codes should generate URLs: `/machine/{category}/{machineName}`

## Styling System

Uses Tailwind with custom KGF brand colors defined in `tailwind.config.js`:
- `kgf-primary`: Orange (#FF6B35) - main brand color
- `kgf-secondary`: Dark gray (#1A1A1A) - backgrounds  
- `kgf-accent`: Light orange (#F7931E) - highlights

Components use utility classes with custom component classes for buttons and cards.