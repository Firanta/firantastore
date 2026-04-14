import React from 'react';
import VideoBackground from './VideoBackground';

/**
 * CONTOH PENGGUNAAN VideoBackground COMPONENT
 * 
 * VideoBackground adalah komponen yang bisa di-reuse di berbagai section
 * dengan customization yang fleksibel
 */

// ================================================================
// EXAMPLE 1: Hero Section (Default - Sudah implementasi)
// ================================================================
export const HeroWithVideo = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <VideoBackground
        videoSource="/videos/hero-bg.mp4"
        overlay={true}
        overlayOpacity={0.45}
      />
      
      {/* Konten di atas video */}
      <div className="relative z-10">
        <h1>Welcome to FirantaStore</h1>
      </div>
    </section>
  );
};

// ================================================================
// EXAMPLE 2: Dark Overlay - Untuk Readability Maksimal
// ================================================================
export const DarkOverlayVideo = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <VideoBackground
        videoSource="/videos/service-bg.mp4"
        overlay={true}
        overlayOpacity={0.65}  // Lebih gelap, text lebih readable
      />
      
      <div className="relative z-10">
        <h1>Our Services</h1>
        <p>Text di sini akan jelas terlihat</p>
      </div>
    </section>
  );
};

// ================================================================
// EXAMPLE 3: Minimal Overlay - Subtle Background
// ================================================================
export const SubtleVideo = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <VideoBackground
        videoSource="/videos/subtle-bg.mp4"
        overlay={true}
        overlayOpacity={0.25}  // Sangat subtle, video tetap terlihat
      />
      
      <div className="relative z-10">
        <h1>Subtle Background</h1>
      </div>
    </section>
  );
};

// ================================================================
// EXAMPLE 4: No Overlay - Pure Video (untuk video yang sudah gelap)
// ================================================================
export const PureVideo = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <VideoBackground
        videoSource="/videos/dark-cinematic-bg.mp4"
        overlay={false}  // Tanpa overlay
      />
      
      <div className="relative z-10">
        <h1>Pure Video Background</h1>
      </div>
    </section>
  );
};

// ================================================================
// EXAMPLE 5: Custom Fallback Color
// ================================================================
export const CustomFallback = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <VideoBackground
        videoSource="/videos/hero-bg.mp4"
        fallbackColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        overlay={true}
        overlayOpacity={0.4}
      />
      
      <div className="relative z-10">
        <h1>Custom Gradient Fallback</h1>
      </div>
    </section>
  );
};

// ================================================================
// EXAMPLE 6: Multiple Videos (Portfolio/Gallery)
// ================================================================
export const PortfolioSection = () => {
  const portfolioVideo = [
    {
      id: 1,
      title: "Wedding Portfolio",
      videoSrc: "/videos/wedding-showcase.mp4"
    },
    {
      id: 2,
      title: "Event Showcase",
      videoSrc: "/videos/event-showcase.mp4"
    },
    {
      id: 3,
      title: "Decor Tutorial",
      videoSrc: "/videos/decor-tutorial.mp4"
    }
  ];

  return (
    <div className="space-y-12">
      {portfolioVideo.map(item => (
        <section 
          key={item.id}
          className="relative h-96 flex items-center justify-center"
        >
          <VideoBackground
            videoSource={item.videoSrc}
            overlay={true}
            overlayOpacity={0.5}
          />
          <div className="relative z-10">
            <h2>{item.title}</h2>
          </div>
        </section>
      ))}
    </div>
  );
};

// ================================================================
// EXAMPLE 7: Responsive Hero dengan Video
// ================================================================
export const ResponsiveHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Desktop Video */}
      <div className="hidden md:block absolute inset-0">
        <VideoBackground
          videoSource="/videos/hero-bg-desktop.mp4"
          overlay={true}
          overlayOpacity={0.45}
        />
      </div>

      {/* Mobile Video (bisa video yang berbeda untuk ukuran lebih kecil) */}
      <div className="md:hidden absolute inset-0">
        <VideoBackground
          videoSource="/videos/hero-bg-mobile.mp4"
          overlay={true}
          overlayOpacity={0.45}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold">FirantaStore</h1>
        <p className="text-lg mt-4">Responsive Video Background</p>
      </div>
    </section>
  );
};

// ================================================================
// PROPERTY REFERENCE
// ================================================================
/**
 * VideoBackground Props:
 * 
 * @param {string} videoSource - Path ke video file
 *   Default: "/videos/hero-bg.mp4"
 * 
 * @param {string} fallbackColor - Warna jika video gagal
 *   Default: "rgb(10, 10, 20)"
 *   Bisa: hex, rgb, atau gradient
 * 
 * @param {boolean} overlay - Tampilkan overlay?
 *   Default: true
 *   Guna: Meningkatkan readability text
 * 
 * @param {number} overlayOpacity - Opacity overlay (0-1)
 *   Default: 0.4
 *   Semakin tinggi = lebih gelap
 *   Contoh: 0.25 (subtle), 0.45 (balanced), 0.65 (dark)
 * 
 * @param {boolean} muted - Mute audio?
 *   Default: true
 *   Catatan: Browser modern require muted untuk autoplay
 * 
 * @param {boolean} autoplay - Auto play video?
 *   Default: true
 * 
 * @param {boolean} loop - Loop video?
 *   Default: true
 * 
 * @param {boolean} playsInline - Play inline di mobile?
 *   Default: true
 *   Guna: Mencegah fullscreen saat di mobile
 */

// ================================================================
// OVERLAY OPACITY GUIDELINES
// ================================================================
/**
 * Pilih opacity berdasarkan kebutuhan:
 * 
 * 0.15 - 0.25: Subtle, video sangat terlihat, tapi text agak terang
 * 0.25 - 0.40: Balanced, video terlihat tapi text readable (RECOMMENDED)
 * 0.40 - 0.60: Dark, text sangat readable, video subtle
 * 0.60+       : Very Dark, fokus pada text, video barely visible
 * 
 * Tips:
 * - Light colored text: gunakan opacity 0.40+
 * - Dark colored text: gunakan opacity 0.15-0.30
 * - White text: opacity 0.30-0.50 optimal
 */

// ================================================================
// PERFORMANCE TIPS
// ================================================================
/**
 * 1. VIDEO SIZE
 *    - Target: 2-5 MB per video
 *    - Resolusi: 1280x720 atau 1920x1080
 * 
 * 2. FORMAT
 *    - Use MP4 (h.264) untuk best compatibility
 *    - Optional: WebM untuk better compression
 * 
 * 3. DURATION
 *    - Keep video 8-15 seconds (untuk loop)
 *    - Shorter = better performance
 * 
 * 4. PRELOAD
 *    - Component setting: preload="auto"
 *    - Video start loading saat page load
 * 
 * 5. LAZY LOADING
 *    - Jika punya banyak video sections
 *    - Gunakan Intersection Observer untuk lazy load
 */

export default {
  HeroWithVideo,
  DarkOverlayVideo,
  SubtleVideo,
  PureVideo,
  CustomFallback,
  PortfolioSection,
  ResponsiveHero
};
