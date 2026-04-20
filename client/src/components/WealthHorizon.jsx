import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, TrendingDown, Target } from 'lucide-react';

const WealthHorizon = ({ balance = 125400, commitments = 15000 }) => {
  // Logic: "Gravity" is the pull of future bills. 
  // Safe-to-spend is balance minus commitments.
  const safeToSpend = balance - commitments;
  const healthPercentage = (safeToSpend / balance) * 100;

  return (
    <div className="relative h-full w-full p-6 flex flex-col justify-between overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <header className="flex justify-between items-center mb-6">
          <div className="p-2 bg-gold/10 rounded-lg text-gold">
            <Target size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textSecondary">
            Wealth Horizon
          </span>
        </header>

        <section>
          <p className="text-textSecondary text-xs font-medium mb-1">Safe-to-Spend</p>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            ₹{safeToSpend.toLocaleString()}
          </h2>
          
          <div className="flex items-center gap-2 text-[10px]">
            <span className={`flex items-center gap-1 ${healthPercentage > 70 ? 'text-success' : 'text-danger'} font-bold`}>
              <Rocket size={10} /> {healthPercentage.toFixed(1)}% Capacity
            </span>
            <span className="text-textSecondary/50 px-2">|</span>
            <span className="text-textSecondary">Next Bill: 1st May</span>
          </div>
        </section>
      </div>

      {/* The "Gravity" Meter (Handcrafted Feel) */}
      <div className="relative mt-8 h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${healthPercentage}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-gold/50 via-gold to-white shadow-[0_0_20px_rgba(200,168,75,0.4)]"
        />
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
          <p className="text-[10px] text-textSecondary mb-1 flex items-center gap-1">
             <TrendingDown size={10} className="text-danger" /> Commitments
          </p>
          <p className="text-sm font-bold text-white">₹{commitments.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-white/2 rounded-2xl border border-white/5">
          <p className="text-[10px] text-textSecondary mb-1">Status</p>
          <p className="text-sm font-bold text-gold">High Liquidity</p>
        </div>
      </div>
    </div>
  );
};

export default WealthHorizon;
