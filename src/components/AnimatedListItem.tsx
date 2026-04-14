import { useRef, useEffect } from "react";
import { animate as animeAnimate, set as animeSet } from "animejs";
import { LucideIcon } from "lucide-react";

interface AnimatedListItemProps {
  icon?: LucideIcon;
  text: string;
  index: number;
  baseDelay?: number;
}

const AnimatedListItem = ({
  icon: Icon,
  text,
  index,
  baseDelay = 0,
}: AnimatedListItemProps) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    // Initial state
    animeSet(itemRef.current, { opacity: 0, translateX: -20 });
    if (iconRef.current) {
      animeSet(iconRef.current, { scale: 0 });
    }

    const delay = baseDelay + index * 80;

    // Item entrance
    animeAnimate(itemRef.current, {
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 600,
      delay,
      easing: "easeOutCubic",
    });

    // Icon scale entrance
    if (iconRef.current) {
      animeAnimate(iconRef.current, {
        scale: [0, 1.2, 1],
        duration: 700,
        delay: delay + 100,
        easing: "easeOutElastic(1, .6)",
      });
    }

    // Hover effect
    const handleMouseEnter = () => {
      if (!itemRef.current) return;
      animeAnimate(itemRef.current, {
        translateX: 8,
        duration: 300,
        easing: "easeOutQuad",
      });
      if (iconRef.current) {
        animeAnimate(iconRef.current, {
          scale: 1.3,
          rotate: 360,
          duration: 400,
          easing: "easeOutCubic",
        });
      }
    };

    const handleMouseLeave = () => {
      if (!itemRef.current) return;
      animeAnimate(itemRef.current, {
        translateX: 0,
        duration: 300,
        easing: "easeOutQuad",
      });
      if (iconRef.current) {
        animeAnimate(iconRef.current, {
          scale: 1,
          rotate: 0,
          duration: 400,
          easing: "easeOutCubic",
        });
      }
    };

    const item = itemRef.current;
    item.addEventListener("mouseenter", handleMouseEnter);
    item.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      item.removeEventListener("mouseenter", handleMouseEnter);
      item.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index, baseDelay]);

  return (
    <li
      ref={itemRef}
      className="flex items-start gap-3 text-sm group cursor-pointer"
    >
      {Icon && (
        <div className="flex-shrink-0">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon
              ref={iconRef}
              className="w-4 h-4 text-primary mt-0.5 shrink-0"
            />
          </div>
        </div>
      )}
      <span className="text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">
        {text}
      </span>
    </li>
  );
};

export default AnimatedListItem;
