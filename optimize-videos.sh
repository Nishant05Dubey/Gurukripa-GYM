#!/bin/bash

# Video Optimization Script for KGF Gym
# This script compresses videos to reduce loading time while maintaining quality

echo "🎬 Starting video optimization for KGF Gym..."

cd public/machines/arm-machine

# Create optimized versions directory
mkdir -p optimized

# Optimize each video
for video in *.mp4; do
    if [[ "$video" != "optimized"* ]]; then
        echo "📹 Optimizing $video..."
        
        # High-quality mobile-optimized compression
        ffmpeg -i "$video" \
            -c:v libx264 \
            -preset medium \
            -crf 28 \
            -maxrate 1000k \
            -bufsize 2000k \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" \
            "optimized/opt_$video"
            
        echo "✅ Optimized: $video"
    fi
done

echo "🎉 Video optimization complete!"
echo "📊 Size comparison:"
echo "Original sizes:"
ls -lh *.mp4 | grep -v optimized
echo ""
echo "Optimized sizes:"
ls -lh optimized/*.mp4