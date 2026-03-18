import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker = ({ data, type }) => {
  // data for crypto: name, current_price, price_change_percentage_24h
  // data for stocks: '01. symbol', '05. price', '10. change percent'
  
  const isCrypto = type === 'crypto';
  const name = isCrypto ? data.name : data['01. symbol'];
  const price = isCrypto ? data.current_price : parseFloat(data['05. price']);
  const change = isCrypto ? data.price_change_percentage_24h : parseFloat(data['10. change percent']);
  const isPositive = change >= 0;

  return (
    <div className="bg-[#112240] p-4 rounded-xl border border-[#c8a84b] border-opacity-5 flex items-center justify-between min-w-[200px]">
      <div>
        <p className="text-[#8892b0] text-xs font-bold uppercase tracking-wider">{name}</p>
        <p className="text-[#e6f1ff] font-bold text-lg">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="text-sm font-bold">{Math.abs(change).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export default MarketTicker;
