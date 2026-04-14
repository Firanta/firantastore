import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  variant?: 'typewriter' | 'letterPop' | 'slideIn' | 'fadeInScale' | 'glitch' | 'morphing';
  speed?: number;
  color?: string;
  fontSize?: number;
  className?: string;
  onComplete?: () => void;
  responsiveSizes?: {
    mobile?: number;  // xs
    tablet?: number;  // md
    desktop?: number; // lg
  };
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = 'typewriter',
  speed = 50,
  color = '#1F2937',
  fontSize = 24,
  className = '',
  onComplete,
  responsiveSizes = { mobile: 16, tablet: 20, desktop: 24 },
}) => {
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);

  // Handle responsive font size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentFontSize(responsiveSizes.mobile || 16);
      } else if (window.innerWidth < 1024) {
        setCurrentFontSize(responsiveSizes.tablet || 20);
      } else {
        setCurrentFontSize(responsiveSizes.desktop || fontSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fontSize, responsiveSizes]);

  const getAnimationVariants = (variant: string) => {
    const durationMs = speed;
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: variant === 'typewriter' ? durationMs / text.length / 1000 : durationMs / 1000,
        },
      },
    };

    const itemVariants = {
      typewriter: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      letterPop: {
        hidden: { opacity: 0, scale: 0, rotate: -360 },
        visible: { opacity: 1, scale: 1, rotate: 0 },
      },
      slideIn: {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      },
      fadeInScale: {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
      },
      glitch: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      morphing: {
        hidden: { opacity: 0, scale: 2, rotate: 180 },
        visible: { opacity: 1, scale: 1, rotate: 0 },
      },
    };

    return {
      containerVariants,
      itemVariants: itemVariants[variant as keyof typeof itemVariants] || itemVariants.typewriter,
    };
  };

  const { containerVariants, itemVariants } = getAnimationVariants(variant);

  return (
    <div
      className={`animated-container ${className}`}
      style={{
        fontSize: `${currentFontSize}px`,
        color: color,
        fontWeight: 'bold',
      }}
    >
      <motion.div
        className="animated-text"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            className="letter-char"
            variants={itemVariants}
            transition={{
              duration: speed / 1000,
            }}
            style={{
              display: variant === 'typewriter' ? 'inline' : 'inline-block',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedText;
