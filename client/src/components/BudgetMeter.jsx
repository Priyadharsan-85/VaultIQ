import React from 'react';

const BudgetMeter = ({ category, spent, limit }) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  
  const getColor = (percent) => {
    if (percent < 60) return '#4ade80'; // Green
    if (percent < 80) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  const color = getColor(percentage);

  return (
    <div className="bg-[#112240] p-5 rounded-xl border border-[#c8a84b] border-opacity-5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-[#e6f1ff] font-semibold">{category}</h4>
        <span className="text-sm font-bold" style={{ color }}>{Math.round(percentage)}%</span>
      </div>
      
      <div className="w-full h-3 bg-[#0a1628] rounded-full overflow-hidden mb-3">
        <div 
          className="h-full transition-all duration-500" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      
      <div className="flex justify-between text-xs font-medium">
        <span className="text-[#8892b0]">Spent: ₹{spent.toLocaleString()}</span>
        <span className="text-[#8892b0]">Limit: ₹{limit.toLocaleString()}</span>
      </div>
      
      {percentage >= 80 && (
        <div className="mt-3 p-2 bg-red-400 bg-opacity-10 border border-red-400 border-opacity-20 rounded-lg">
          <p className="text-red-400 text-[10px] text-center font-bold">
            Warning: You've used {Math.round(percentage)}% of your {category} budget!
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetMeter;
