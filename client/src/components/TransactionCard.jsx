import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, Plane, Film, CreditCard, ShieldAlert } from 'lucide-react';

const TransactionCard = ({ transaction }) => {
  const getIcon = (category) => {
    switch (category) {
      case 'Food': return Utensils;
      case 'Travel': return Plane;
      case 'Shopping': return ShoppingBag;
      case 'Entertainment': return Film;
      default: return CreditCard;
    }
  };

  const Icon = getIcon(transaction.category);

  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="glass-card p-4 flex items-center justify-between group"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gold/10 rounded-xl text-gold group-hover:bg-gold group-hover:text-darkBg transition-all duration-300">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-white font-bold group-hover:text-gold transition-colors">{transaction.merchantName}</h4>
          <p className="text-textSecondary text-[10px] uppercase font-black tracking-widest">
            {new Date(transaction.transactionTime).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-black ${transaction.isFraud ? 'text-red-400' : 'text-white'}`}>
          ₹{transaction.amount.toLocaleString()}
        </p>
        {transaction.isFraud ? (
          <div className="flex items-center justify-end space-x-1 text-red-500">
             <ShieldAlert size={10} />
             <span className="text-[10px] font-black uppercase tracking-tighter">Flagged</span>
          </div>
        ) : (
          <p className="text-[10px] text-textSecondary font-bold uppercase">{transaction.category}</p>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionCard;
