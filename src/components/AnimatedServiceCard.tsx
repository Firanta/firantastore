import { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { animate as animeAnimate, set as animeSet } from 'animejs';

interface AnimatedServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const AnimatedServiceCard = ({ icon: Icon, title, description, index }: AnimatedServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !iconRef.current) return;

    // Initial state
    animeSet(cardRef.current, {
      opacity: 0,
      translateY: 40,
      scale: 0.95,
    });

    animeSet(iconRef.current, {
      scale: 0,
      rotate: -180,
    });

    // Entrance animation with delay based on index
    animeAnimate(cardRef.current, {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.95, 1],
      duration: 800,
      delay: index * 150,
      easing: 'easeOutCubic',
    });

    // Icon entrance
    animeAnimate(iconRef.current, {
      scale: [0, 1.2, 1],
      rotate: [-180, 0],
      duration: 900,
      delay: index * 150 + 100,
      easing: 'easeOutElastic(1, 0.5)',
    });

    // Hover effect handler
    const handleMouseEnter = () => {
      animeAnimate(cardRef.current, {
        translateY: -10,
        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)',
        duration: 400,
        easing: 'easeOutQuad',
      });

      animeAnimate(iconRef.current, {
        scale: 1.15,
        rotate: 10,
        duration: 400,
        easing: 'easeOutQuad',
      });
    };

    const handleMouseLeave = () => {
      animeAnimate(cardRef.current, {
        translateY: 0,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        duration: 400,
        easing: 'easeOutQuad',
      });

      animeAnimate(iconRef.current, {
        scale: 1,
        rotate: 0,
        duration: 400,
        easing: 'easeOutQuad',
      });
    };

    cardRef.current.addEventListener('mouseenter', handleMouseEnter);
    cardRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cardRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="glass glow-border rounded-2xl p-8 group hover:bg-white/[0.08] transition-colors duration-500 cursor-pointer"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        willChange: 'transform, opacity, box-shadow',
      }}
    >
      <div
        ref={iconRef}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-5 shadow-lg"
        style={{ willChange: 'transform' }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default AnimatedServiceCard;
