import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";

interface AnimatedSectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
}

const AnimatedSectionHeader = ({
  label,
  title,
  subtitle,
  alignment = "center",
}: AnimatedSectionHeaderProps) => {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!labelRef.current || !titleRef.current) return;

    // Initial state
    animeSet(labelRef.current, { opacity: 0, scaleX: 0 });
    animeSet(titleRef.current, { opacity: 0, translateY: 30 });
    if (subtitleRef.current) {
      animeSet(subtitleRef.current, { opacity: 0, translateY: 20 });
    }

    // Entrance animation
    setTimeout(() => {
      if (!labelRef.current || !titleRef.current) return;

      // Label entrance with scale
      animeAnimate(labelRef.current, {
        opacity: [0, 1],
        scaleX: [0, 1],
        duration: 600,
        easing: "easeOutCubic",
      });

      // Title entrance
      animeAnimate(titleRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
        delay: 150,
        easing: "easeOutCubic",
      });

      // Subtitle entrance
      if (subtitleRef.current) {
        animeAnimate(subtitleRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: 300,
          easing: "easeOutCubic",
        });
      }
    }, 100);
  }, []);

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[alignment];

  return (
    <div className={alignmentClass}>
      <p
        ref={labelRef}
        className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 inline-block origin-left"
      >
        {label}
      </p>
      <h2
        ref={titleRef}
        className="text-4xl md:text-5xl font-bold text-gradient mb-6"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          ref={subtitleRef}
          className={`text-muted-foreground ${
            alignment === "center" ? "max-w-xl mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AnimatedSectionHeader;
