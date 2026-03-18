import React from 'react';
import { format } from 'date-fns';
import { ShoppingBag, Utensils, Plane, Film, CreditCard } from 'lucide-react';

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
    <div className="bg-[#112240] p-4 rounded-xl border border-[#c8a84b] border-opacity-5 hover:border-opacity-20 transition-all flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-[#c8a84b] bg-opacity-10 rounded-lg text-[#c8a84b]">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-[#e6f1ff] font-semibold">{transaction.merchantName}</h4>
          <p className="text-[#8892b0] text-sm">{format(new Date(transaction.transactionTime), 'MMM dd, yyyy • HH:mm')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${transaction.isFraud ? 'text-red-400' : 'text-[#e6f1ff]'}`}>
          ₹{transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-[#8892b0]">{transaction.category}</p>
        {transaction.isFraud && (
          <span className="text-[10px] bg-red-400 bg-opacity-10 text-red-400 px-2 py-0.5 rounded-full border border-red-400 border-opacity-20">
            Fraud Detected
          </span>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
