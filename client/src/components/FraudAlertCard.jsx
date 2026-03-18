import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MapPin, Calendar, CheckSquare } from 'lucide-react';

const FraudAlertCard = ({ alert }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 border-l-4 border-l-red-500 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <ShieldAlert size={80} className="text-red-500" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">
              High Risk Detected
            </span>
            <h3 className="text-xl font-black text-white mt-3 italic">₹{alert.Transaction.amount.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
            <ShieldAlert size={24} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2 text-sm text-textSecondary">
            <CheckSquare size={16} className="text-red-500/50" />
            <span className="font-bold">{alert.Transaction.merchantName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-textSecondary">
            <MapPin size={16} className="text-red-500/50" />
            <span className="font-bold">{alert.Transaction.location}</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
          <div className="flex items-center space-x-2 text-xs text-textSecondary italic">
            <Calendar size={14} />
            <span>{new Date(alert.createdAt).toLocaleString()}</span>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors">
            Resolve Alert
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FraudAlertCard;
