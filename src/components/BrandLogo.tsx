import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  text: string;
  animationType?: 'wave' | 'bounce' | 'spin' | 'color' | 'pulse' | 'glow' | 'flip' | 'wordSpin' | 'letterSpinUp';
  fontSize?: number;
  color?: string;
  duration?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
  responsiveSizes?: {
    mobile?: number;  // xs
    tablet?: number;  // md
    desktop?: number; // lg
  };
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  text,
  animationType = 'wave',
  fontSize = 48,
  color = '#000000',
  duration = 1500,
  delay = 100,
  loop = true,
  className = '',
  responsiveSizes = { mobile: 24, tablet: 36, desktop: 48 },
}) => {
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive font size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
        setCurrentFontSize(responsiveSizes.mobile || 24);
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
        setCurrentFontSize(responsiveSizes.tablet || 36);
      } else {
        setScreenSize('desktop');
        setCurrentFontSize(responsiveSizes.desktop || fontSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fontSize, responsiveSizes]);

  const getLetterVariants = (index: number) => {
    const delayInSeconds = (index * delay) / 1000;

    switch (animationType) {
      case 'wave':
        return {
          initial: { y: 0 },
          animate: {
            y: [0, -25, 0],
            transition: {
              duration: duration / 1000,
              delay: delayInSeconds,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
            },
          },
        };

      case 'bounce':
        return {
          initial: { y: 0 },
          animate: {
            y: [0, -40, 0],
            transition: {
              duration: duration / 1000,
              delay: delayInSeconds,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
            },
          },
        };

      case 'spin':
        return {
          initial: { rotate: 0 },
          animate: {
            rotate: 360,
            transition: {
              duration: (duration / 1000) * 0.6, // Spin duration (faster)
              delay: 0,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
              repeatDelay: 3, // 3 seconds pause after spin
            },
          },
        };

      case 'pulse':
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 1.3, 1],
            transition: {
              duration: (duration / 1000) * 0.8,
              delay: delayInSeconds,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
            },
          },
        };

      case 'glow':
        return {
          initial: { opacity: 0.6, textShadow: `0 0 0px ${color}` },
          animate: {
            opacity: [0.6, 1, 0.6],
            textShadow: [
              `0 0 5px ${color}`,
              `0 0 20px ${color}, 0 0 40px ${color}`,
              `0 0 5px ${color}`,
            ],
            transition: {
              duration: (duration / 1000) * 0.8,
              delay: delayInSeconds,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
            },
          },
        };

      case 'flip':
        return {
          initial: { rotateY: 0 },
          animate: {
            rotateY: 360,
            transition: {
              duration: (duration / 1000) * 1.5,
              delay: 0,
              repeat: loop ? Infinity : 0,
              repeatType: 'loop' as const,
            },
          },
        };

      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
    }
  };

  const getWordVariants = (wordIndex: number, totalWords: number) => {
    const wordDelay = wordIndex * 1; // 1 second per word
    const totalAnimationTime = totalWords * 1 + 3; // Total time for all words + 3s pause

    return {
      initial: { y: 0, rotate: 0 },
      animate: {
        y: [0, -30, 0],
        rotate: [0, 360, 360],
        transition: {
          duration: 1.2,
          delay: wordDelay,
          repeat: loop ? Infinity : 0,
          repeatType: 'loop' as const,
          repeatDelay: 3 + (totalWords - wordIndex - 1) * 1, // Pause after all words done
          times: [0, 0.5, 1], // Control keyframe timing
          ease: 'easeInOut',
        },
      },
    };
  };

  const getLetterSpinUpVariants = (index: number, totalLetters: number) => {
    // Filter out spaces for timing calculation
    const lettersOnly = text.split('').filter(l => l !== ' ');
    const totalLetterCount = lettersOnly.length;
    
    return {
      initial: { y: 0, rotate: 0 },
      animate: {
        y: [0, -25, 0],
        rotate: [0, 360, 360],
        transition: {
          duration: 0.6,
          // For ping-pong effect: first cycle forward, second cycle backward, etc
          delay: (index * 0.15),
          repeat: loop ? Infinity : 0,
          repeatType: 'reverse' as const, // This makes it bounce back
          repeatDelay: 3, // 3 seconds pause before repeating in reverse
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        },
      },
    };
  };

  return (
    <div
      ref={containerRef}
      className={`inline-flex gap-0 font-bold tracking-wider ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {animationType === 'wordSpin' ? (
        // Word-based animation
        text.split(' ').map((word, wordIndex) => {
          const words = text.split(' ');
          const wordVariants = getWordVariants(wordIndex, words.length);
          return (
            <motion.span
              key={wordIndex}
              initial={wordVariants.initial}
              animate={wordVariants.animate}
              style={{
                fontSize: `${currentFontSize}px`,
                color: color,
                display: 'inline-block',
                fontWeight: 'bold',
                marginRight: wordIndex < words.length - 1 ? '0.5em' : '0',
                transformStyle: 'preserve-3d',
              }}
            >
              {word}
            </motion.span>
          );
        })
      ) : animationType === 'letterSpinUp' ? (
        // Letter-based spin up animation
        text.split('').map((letter, index) => {
          const letterVariants = getLetterSpinUpVariants(index, text.length);
          return (
            <motion.span
              key={index}
              initial={letterVariants.initial}
              animate={letterVariants.animate}
              style={{
                fontSize: `${currentFontSize}px`,
                color: color,
                display: 'inline-block',
                fontWeight: 'bold',
                transformStyle: 'preserve-3d',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })
      ) : (
        // Original letter-based animation
        text.split('').map((letter, index) => {
          const letterVariants = getLetterVariants(index);
          return (
            <motion.span
              key={index}
              className="letter"
              initial={letterVariants.initial}
              animate={letterVariants.animate}
              style={{
                fontSize: `${currentFontSize}px`,
                color: color,
                display: 'inline-block',
                fontWeight: 'bold',
                transformStyle: animationType === 'flip' ? 'preserve-3d' : 'flat',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })
      )}
    </div>
  );
};

export default BrandLogo;
