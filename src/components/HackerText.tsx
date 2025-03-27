import React from 'react';
import { motion } from 'framer-motion';

interface HackerTextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'paragraph' | 'terminal';
  className?: string;
  delay?: number;
}

export function HackerText({ 
  children, 
  variant = 'paragraph',
  className = '',
  delay = 0 
}: HackerTextProps) {
  const variants = {
    heading: 'hacker-heading',
    paragraph: 'hacker-paragraph',
    terminal: 'hacker-text'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`${variants[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );
}