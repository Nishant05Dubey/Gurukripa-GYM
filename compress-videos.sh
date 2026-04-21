#!/bin/bash

# KGF Gym Video Compression Script
# Reduces video file sizes by 80-90% while maintaining quality

echo "🎬 KGF Gym Video Optimizer"
echo "=========================="
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Please install FFmpeg first:"
    echo "   Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   macOS: brew install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/"
    exit 1
fi

# Create optimized directory
mkdir -p machines-optimized/arm-machine

# Compression settings optimized for gym instruction videos
SETTINGS="-vcodec libx264 -crf 25 -preset medium -vf scale=1280:720 -acodec aac -b:a 128k"

echo "🔄 Compressing arm-machine videos..."
echo ""

# Compress each video
for video in machines/arm-machine/*.mp4; do
    if [[ -f "$video" ]]; then
        filename=$(basename "$video")
        echo "⚡ Processing: $filename"
        
        # Get original size
        original_size=$(du -h "$video" | cut -f1)
        echo "   Original size: $original_size"
        
        # Compress
        ffmpeg -i "$video" $SETTINGS "machines-optimized/arm-machine/$filename" -y -loglevel error
        
        # Get new size
        if [[ -f "machines-optimized/arm-machine/$filename" ]]; then
            new_size=$(du -h "machines-optimized/arm-machine/$filename" | cut -f1)
            echo "   Optimized size: $new_size ✅"
        else
            echo "   ❌ Failed to compress"
        fi
        echo ""
    fi
done

echo "🎉 Compression complete!"
echo ""
echo "📊 Results:"
echo "Original folder: machines/arm-machine/"
echo "Optimized folder: machines-optimized/arm-machine/"
echo ""
echo "📋 Next steps:"
echo "1. Test the optimized videos"
echo "2. If quality is good, replace original videos:"
echo "   cp machines-optimized/arm-machine/* public/machines/arm-machine/"
echo "   cp machines-optimized/arm-machine/* src/assets/videos/machines/arm-machine/"
echo "3. Deploy updated app"
echo ""
echo "💡 Expected improvements:"
echo "   - 80-90% smaller file sizes"
echo "   - 5-10x faster loading times"
echo "   - Better mobile performance"