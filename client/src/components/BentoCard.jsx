import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", spanCols = 1, spanRows = 1 }) => {
  const colClass = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
  }[spanCols];

  const rowClass = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
  }[spanRows];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`glass-card relative overflow-hidden group ${colClass} ${rowClass} ${className}`}
    >
      <div className="neon-glow" />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default BentoCard;
