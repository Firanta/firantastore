# 📹 Quick Start: Background Video

## 1️⃣ Dapatkan Video

### **Sumber Terbaik (Gratis):**
1. **Pixabay Videos** - https://pixabay.com/videos (⭐ Recommended)
   - Cari: "particles", "flowers", "abstract", "light"
   - Download: Klik tombol download di video
   
2. **Pexels Videos** - https://pexels.com/videos
3. **Mixkit** - https://mixkit.co/
4. **Unsplash** - https://unsplash.com (cari di section videos)

---

## 2️⃣ Compress Video (PENTING!)

### **Mac/Linux:**
```bash
chmod +x compress-video.sh
./compress-video.sh your-video.mp4
```

### **Windows:**
```cmd
compress-video.bat your-video.mp4
```

### **Atau pakai ffmpeg langsung:**
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow output.mp4
```

---

## 3️⃣ Letakkan Video

```
Letakkan file di: public/videos/hero-bg.mp4
```

**Struktur:**
```
FirantaStore/firantastore-main/
├── public/
│   └── videos/
│       └── hero-bg.mp4  ← Taruh di sini
```

---

## 4️⃣ Cek di Browser

```bash
npm run dev
# Buka http://localhost:5173
```

✅ **Hero section sudah pake background video!**

---

## ⚙️ Customize (Opsional)

Edit `src/components/HeroSection.tsx`:

```tsx
<VideoBackground
  videoSource="/videos/hero-bg.mp4"      // Ganti path/filename
  overlay={true}                          // Tampilkan overlay
  overlayOpacity={0.45}                   // Normalize overlay (0-1)
/>
```

---

## 📊 Ukuran File Target

| Resolusi | Target |
|----------|--------|
| HD (720p) | 2-3 MB |
| FHD (1080p) | 4-5 MB |

---

## ❓ Troubleshooting

| Problem | Solusi |
|---------|--------|
| Video tidak muncul | Check path di `public/videos/` |
| Video sangat besar | Compress dengan script |
| Video lambat | Kurangi resolusi atau format WebM |
| Text tidak terbaca | Naikkan `overlayOpacity` (contoh: 0.55) |

---

## 📖 Full Documentation

Lihat: `VIDEO_BACKGROUND_SETUP.md` untuk panduan lengkap

---

**Setup selesai! 🎉**
