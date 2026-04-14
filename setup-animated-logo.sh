#!/bin/bash

# 🎬 Animated Brand Logo Setup Script
# Setup Anime.js dan komponen animasi untuk FirantaStore

echo "🚀 Starting Animated Brand Logo Setup..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing Anime.js..."
npm install animejs

echo ""
echo "📦 Installing Type Definitions..."
npm install --save-dev @types/animejs

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Import components in your files:"
echo "   import BrandLogo from '@/components/BrandLogo';"
echo "   import AnimatedText from '@/components/AnimatedText';"
echo ""
echo "2. Or view the showcase:"
echo "   import LogoShowcase from '@/components/LogoShowcase';"
echo ""
echo "3. Check the documentation:"
echo "   📖 ANIMATED_LOGO_GUIDE.md"
echo ""
echo "🎨 Happy animating! 🎉"
