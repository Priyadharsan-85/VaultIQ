import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker = ({ data, type }) => {
  if (!data) return null;

  const name = type === 'crypto' ? data.name : data['01. symbol'];
  const price = type === 'crypto' ? data.current_price : parseFloat(data['05. price']);
  const change = type === 'crypto' ? data.price_change_percentage_24h : parseFloat(data['10. change percent']);
  const isUp = change >= 0;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 flex flex-col justify-between h-40 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold opacity-[0.03] blur-2xl group-hover:opacity-10 transition-opacity rounded-full -mr-12 -mt-12" />
      
      <div className="relative z-10 flex justify-between items-start">
        <span className="text-xs font-black text-textSecondary tracking-widest uppercase">{type}</span>
        <div className={`p-2 rounded-lg ${isUp ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'}`}>
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <h4 className="text-sm font-bold text-textSecondary truncate">{name}</h4>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-black text-white">
            {type === 'crypto' ? '$' : '₹'}{price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className={`text-[10px] font-black ${isUp ? 'text-success' : 'text-red-400'}`}>
            {isUp ? '+' : ''}{change?.toFixed(2)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketTicker;
