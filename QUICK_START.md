# 🎬 Quick Start - Animated Brand Logo

## ⚡ Setup Super Cepat

### 1. Install Anime.js
```bash
npm install animejs @types/animejs
```

### 2. Copy Components
Sudah ada di:
- `src/components/BrandLogo.tsx`
- `src/components/AnimatedText.tsx`
- `src/components/LogoShowcase.tsx`

### 3. Gunakan di Project

#### Di Navbar (Responsive):
```tsx
import BrandLogo from '@/components/BrandLogo';

<BrandLogo 
  text="FIRANTA STORE" 
  animationType="wave"
  fontSize={32}
  responsiveSizes={{
    mobile: 16,
    tablet: 24,
    desktop: 32
  }}
/>
```

#### Di Hero Section (Responsive):
```tsx
<BrandLogo 
  text="FIRANTA" 
  animationType="bounce" 
  fontSize={64}
  color="#6366F1"
  responsiveSizes={{
    mobile: 32,
    tablet: 48,
    desktop: 64
  }}
/>
```

#### Lihat Semua Animasi:
```tsx
import LogoShowcase from '@/components/LogoShowcase';

<LogoShowcase />
```

## 🎨 Animasi Tersedia

### Logo Animations (7 tipe)
- ✨ **wave** - Gelombang smooth
- ⛹️ **bounce** - Melompat-lompat
- 🌀 **spin** - Putar & fade
- 🌈 **color** - Perubahan warna
- 💗 **pulse** - Membesar/mengecil
- 💡 **glow** - Cahaya dinamis
- 🔄 **flip** - Rotasi 3D

### Text Animations (6 tipe)
- ⌨️ **typewriter** - Efek mengetik
- 🎪 **letterPop** - Pop dengan rotate
- 🚀 **slideIn** - Meluncur masuk
- ✨ **fadeInScale** - Fade + scale
- 🎲 **glitch** - Digital glitch
- 🔄 **morphing** - Transformasi

## 📊 Props Penting

### BrandLogo
```tsx
<BrandLogo
  text="Brand"              // Teks apa
  animationType="wave"      // Jenis animasi
  fontSize={48}             // Ukuran font
  color="#1F2937"           // Warna
  duration={1500}           // Durasi (ms)
  delay={100}               // Delay antar huruf (ms)
  loop={true}               // Ulang? true/false
/>
```

### AnimatedText
```tsx
<AnimatedText
  text="Your Text"
  variant="typewriter"
  speed={50}
  fontSize={24}
  color="#1F2937"
/>
```

## 🎯 Use Cases

| Lokasi | Animasi Cocok | Contoh |
|--------|---------------|---------|
| Navbar | wave, glow | Logo kecil yang smooth |
| Hero | bounce, pulse | Logo besar yang powerful |
| Button | spin | CTA yang eye-catching |
| Loading | color, pulse | Loading screen |
| Tagline | typewriter | Intro text |

## 🔧 Troubleshooting

**Animasi tidak jalan?**
```tsx
// ✅ Check import
import anime from 'animejs';
```

**Lag/Performance issues?**
```tsx
// ✅ Gunakan delay lebih kecil atau loop={false}
<BrandLogo delay={50} loop={false} />
```

## 📖 Dokumentasi Lengkap
Lihat: `ANIMATED_LOGO_GUIDE.md`

## 🧪 Test Showcase
Kunjungi: `src/pages/AnimatedBrandDemo.tsx`

---

**Tip:** Mulai dengan `animationType="wave"` untuk hasil terbaik! 🚀
