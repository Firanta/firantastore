import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  videoSource?: string; // Default video source
  fallbackColor?: string; // Fallback color if video fails
  overlay?: boolean; // Add dark overlay for text readability
  overlayOpacity?: number; // Overlay opacity (0-1)
  muted?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

const VideoBackground = ({
  videoSource = "/videos/hero-bg.mp4",
  fallbackColor = "rgb(10, 10, 20)",
  overlay = true,
  overlayOpacity = 0.4,
  muted = true,
  autoplay = true,
  loop = true,
  playsInline = true,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video load
    const handleLoadedData = () => {
      setVideoLoaded(true);
      // Auto-play untuk performance
      if (autoplay) {
        video.play().catch(() => {
          // Browser mungkin memblok auto-play, silent fail
          console.log("Video autoplay blocked by browser");
        });
      }
    };

    // Handle video error
    const handleError = () => {
      console.warn("Video background failed to load");
      setVideoFailed(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [autoplay]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: fallbackColor }}
    >
      {/* Video Background */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          muted={muted}
          autoPlay={autoplay}
          loop={loop}
          playsInline={playsInline}
          preload="auto"
        >
          <source src={videoSource} type="video/mp4" />
          {/* Fallback untuk older browsers */}
          <p>Video background tidak didukung oleh browser Anda.</p>
        </video>
      )}

      {/* Gradient Overlay untuk readability */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Additional gradient untuk kontras lebih baik */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Subtle noise texture untuk mengurangi banding */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23000' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
    </div>
  );
};

export default VideoBackground;
