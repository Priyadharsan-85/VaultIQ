import React from 'react';
import { motion } from 'framer-motion';

const BudgetMeter = ({ category, spent, limit }) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-lg font-black text-white">{category}</h4>
          <p className="text-xs text-textSecondary font-bold">₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}</p>
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${isOver ? 'text-red-400' : 'text-gold'}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-gold to-goldHover shadow-[0_0_15px_rgba(200,168,75,0.4)]'}`}
        />
      </div>

      <div className="flex justify-between text-[10px] font-bold text-textSecondary uppercase tracking-tighter italic">
        <span>Starting ₹0</span>
        <span>Limit ₹{limit.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BudgetMeter;
