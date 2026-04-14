import { useEffect, useRef } from 'react';
import { 
  createTimeline, 
  stagger as animeStagger, 
  set as animeSet,
  animate as animeAnimate,
  splitText
} from 'animejs';

interface AnimatedHeroTitleProps {
  mainText: string;
  dynamicText: string;
  className?: string;
}

const AnimatedHeroTitle = ({ mainText, dynamicText, className = "" }: AnimatedHeroTitleProps) => {
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const dynamicTitleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    if (!mainTitleRef.current || !dynamicTitleRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.pause();
    }

    const timer = setTimeout(() => {
      if (!mainTitleRef.current || !dynamicTitleRef.current) return;

      try {
        // Split text into characters only
        const mainSplit = splitText(mainTitleRef.current, {
          chars: true,
        });

        const dynamicSplit = splitText(dynamicTitleRef.current, {
          chars: true,
        });

        const mainChars = mainSplit.chars || [];
        const dynamicChars = dynamicSplit.chars || [];

        if (!mainChars || !dynamicChars || mainChars.length === 0) {
          console.warn('[AnimatedHeroTitle] Failed to split text');
          return;
        }

        const allChars = [...mainChars, ...dynamicChars];
        if (import.meta.env.DEV) {
          console.log('[AnimatedHeroTitle] Starting animation for main:', mainChars.length, 'dynamic:', dynamicChars.length, 'total:', allChars.length);
        }

        // Set initial state - larger scale for better visibility
        allChars.forEach((el: any) => {
          animeSet(el, {
            opacity: 0,
            scale: 0.8,
            rotate: -30,
            translateY: 0,
          });
        });

        // Create timeline
        const timeline = createTimeline({
          loop: false,
        });

        // Main text entrance animation
        timeline.add(
          mainChars,
          {
            opacity: [0, 1],
            scale: [0.8, 1.05, 1],
            rotate: [-30, 5, 0],
            translateY: [-12, 0, 0],
            duration: 700,
            easing: 'easeOutCubic',
          },
          animeStagger(40, { from: 'first' })
        );

        // Dynamic text entrance animation - starts at same time as main text
        timeline.add(
          dynamicChars,
          {
            opacity: [0, 1],
            scale: [0.8, 1.05, 1],
            rotate: [-30, 5, 0],
            translateY: [-12, 0, 0],
            duration: 700,
            easing: 'easeOutCubic',
            delay: animeStagger(40, { from: 'first' }),
          },
          0 // Start at same time as main text entrance
        );

        // Floating animation for all chars
        timeline.add(
          allChars,
          {
            translateY: [
              { value: -2, duration: 2500, easing: 'easeInOutQuad' },
              { value: 0, duration: 2500, easing: 'easeInOutQuad' },
            ],
            loop: true,
          },
          900
        );

        // Pulse effect for all chars
        timeline.add(
          allChars,
          {
            scale: [
              { value: 1.05, duration: 2000, easing: 'easeInOutQuad' },
              { value: 1, duration: 2000, easing: 'easeInOutQuad' },
            ],
            loop: true,
          },
          1300
        );

        timeline.init();
        timelineRef.current = timeline;

        // Hover effects
        allChars.forEach((char: any) => {
          const handleMouseEnter = () => {
            animeAnimate(char, {
              scale: 1.4,
              rotate: 360,
              duration: 500,
              easing: 'easeOutElastic(1, 0.6)',
            });
          };

          const handleMouseLeave = () => {
            animeAnimate(char, {
              scale: 1,
              rotate: 0,
              duration: 400,
              easing: 'easeOutQuad',
            });
          };

          char.addEventListener('mouseenter', handleMouseEnter);
          char.addEventListener('mouseleave', handleMouseLeave);
        });
      } catch (error) {
        console.error('[AnimatedHeroTitle] Error:', error);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, [mainText, dynamicText]);

  return (
    <div className={className} style={{ display: 'block', lineHeight: '1.0' }}>
      <h1 
        ref={mainTitleRef}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
        style={{
          color: '#ffffff',
          fontWeight: 900,
          textShadow: '0 0 30px rgba(147, 112, 219, 0.7), 0 0 50px rgba(59, 130, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
          willChange: 'transform',
          letterSpacing: '-0.02em',
          lineHeight: '1.0',
          wordSpacing: '0.1em',
          display: 'block',
          margin: '0',
          padding: '0',
        }}
      >
        {mainText}
      </h1>
      <h1 
        ref={dynamicTitleRef}
        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
        style={{
          color: '#ffffff',
          fontWeight: 900,
          textShadow: '0 0 30px rgba(147, 112, 219, 0.7), 0 0 50px rgba(59, 130, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
          willChange: 'transform',
          letterSpacing: '-0.02em',
          lineHeight: '1.0',
          wordSpacing: '0.1em',
          display: 'block',
          margin: '0',
          padding: '0',
        }}
      >
        {dynamicText}
      </h1>
    </div>
  );
};

export default AnimatedHeroTitle;
