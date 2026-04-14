#!/bin/bash

# Script untuk compress video untuk web
# Usage: ./compress-video.sh input.mp4

if [ -z "$1" ]; then
    echo "❌ Error: Masukkan nama file input"
    echo "Usage: ./compress-video.sh input.mp4"
    exit 1
fi

INPUT_FILE=$1
OUTPUT_FILE="${INPUT_FILE%.*}-compressed.mp4"

echo "🎬 Compressing video: $INPUT_FILE"
echo "📊 Output: $OUTPUT_FILE"

# Check if ffmpeg installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg tidak terinstall"
    echo "Silakan install dengan: brew install ffmpeg"
    exit 1
fi

# Compress dengan optimal settings
ffmpeg -i "$INPUT_FILE" \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -acodec aac \
    -b:a 128k \
    -movflags +faststart \
    "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    # Show file sizes
    INPUT_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
    OUTPUT_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo ""
    echo "✅ Compression selesai!"
    echo "📦 Original: $INPUT_SIZE"
    echo "📦 Compressed: $OUTPUT_SIZE"
    echo ""
    echo "💡 Tip: Pindahkan ke: public/videos/hero-bg.mp4"
else
    echo "❌ Compression gagal"
    exit 1
fi
