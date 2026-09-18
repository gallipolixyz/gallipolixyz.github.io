import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  isText?: boolean;
}

export function ScrollAnimation({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5,
  className = '',
  isText = false
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 30 };
      case 'down': return { opacity: 0, y: -30 };
      case 'left': return { opacity: 0, x: 20 };
      case 'right': return { opacity: 0, x: -20 };
      default: return { opacity: 0, y: 30 };
    }
  };

  const getFinalPosition = () => {
    return { opacity: 1, x: 0, y: 0 };
  };

  useEffect(() => {
    if (isInView) {
      controls.start(getFinalPosition());
    }
  }, [isInView, controls]);

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  if (isText) {
    return (
      <motion.div
        ref={ref}
        variants={textVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className={`${className} hacker-text-reveal`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}