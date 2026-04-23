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
    7: 'row-span-7',
    8: 'row-span-8',
    9: 'row-span-9',
    10: 'row-span-10',
    11: 'row-span-11',
    12: 'row-span-12',
    13: 'row-span-13',
    14: 'row-span-14',
    15: 'row-span-15',
    20: 'row-span-20',
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
