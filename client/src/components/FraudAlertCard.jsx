import React from 'react';
import { ShieldAlert } from 'lucide-react';

const FraudAlertCard = ({ alert, onReview }) => {
  return (
    <div className="bg-[#112240] p-6 rounded-xl border border-red-400 border-opacity-20 hover:border-opacity-40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-red-400 bg-opacity-10 rounded-lg text-red-400">
          <ShieldAlert size={24} />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          alert.status === 'pending' ? 'bg-yellow-400 bg-opacity-10 text-yellow-400' : 'bg-green-400 bg-opacity-10 text-green-400'
        }`}>
          {alert.status.toUpperCase()}
        </span>
      </div>
      
      <h3 className="text-[#e6f1ff] font-bold text-lg mb-1">Potential Fraud Detected</h3>
      <p className="text-[#8892b0] text-sm mb-4">{alert.reason}</p>
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex-1 h-2 bg-[#0a1628] rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-400" 
            style={{ width: `${alert.confidenceScore}%` }}
          />
        </div>
        <span className="text-red-400 font-bold text-sm">{alert.confidenceScore}% Confidence</span>
      </div>

      {alert.status === 'pending' && (
        <div className="flex space-x-3">
          <button 
            onClick={() => onReview('reviewed')}
            className="flex-1 py-2 bg-[#c8a84b] text-[#0a1628] rounded-lg font-bold text-sm hover:bg-[#b6963f] transition-colors"
          >
            Mark as Reviewed
          </button>
        </div>
      )}
    </div>
  );
};

export default FraudAlertCard;
