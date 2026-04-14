import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";

interface AnimatedGlowTextProps {
  children: string;
  className?: string;
  delay?: number;
  glowColor?: "primary" | "accent" | "orange";
}

const AnimatedGlowText = ({
  children,
  className = "",
  delay = 0,
  glowColor = "primary",
}: AnimatedGlowTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    animeSet(textRef.current, { 
      opacity: 0,
      textShadow: `0 0 0px rgba(147, 112, 219, 0)`,
    });

    setTimeout(() => {
      if (!textRef.current) return;

      animeAnimate(textRef.current, {
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutCubic",
      });

      // Pulsing glow effect
      animeAnimate(textRef.current, {
        textShadow: [
          `0 0 10px rgba(147, 112, 219, 0.3)`,
          `0 0 30px rgba(147, 112, 219, 0.8)`,
          `0 0 10px rgba(147, 112, 219, 0.3)`,
        ],
        duration: 3000,
        loop: true,
        easing: "easeInOutQuad",
      });
    }, delay);
  }, [delay]);

  return (
    <span
      ref={textRef}
      className={`inline-block transition-all duration-300 ${className}`}
    >
      {children}
    </span>
  );
};

export default AnimatedGlowText;
