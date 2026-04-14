import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { animate as animeAnimate, set as animeSet } from 'animejs';

interface AnimatedCounterProps {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  index: number;
  isInView?: boolean;
}

const AnimatedCounter = ({ icon: Icon, value, suffix, label, index, isInView = true }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    hasAnimated.current = true;

    // Initial state
    if (counterRef.current) {
      animeSet(counterRef.current, {
        opacity: 0,
        scale: 0.8,
        translateY: 30,
      });

      // Entrance animation
      animeAnimate(counterRef.current, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [30, 0],
        duration: 800,
        delay: index * 150,
        easing: 'easeOutCubic',
      });
    }

    // Counter animation
    const counterObj = { count: 0 };
    animeAnimate(counterObj, {
      count: value,
      duration: 2000,
      delay: 300 + index * 150,
      round: 1,
      easing: 'easeOutCubic',
      update(anim) {
        setDisplayValue(Math.floor((counterObj as any).count));
      },
    });
  }, [isInView, value, index]);

  return (
    <div
      ref={counterRef}
      className="flex flex-col items-center gap-3 p-6 rounded-2xl glass glow-border hover:bg-white/[0.08] transition-colors duration-300 cursor-pointer"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-3xl md:text-4xl font-bold text-foreground">
          {displayValue}
          <span className="text-primary ml-1">{suffix}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
};

export default AnimatedCounter;
