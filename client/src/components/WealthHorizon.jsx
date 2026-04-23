import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, TrendingUp, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

const GoalRing = ({ goal, index }) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const radius = 45 - index * 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={`${radius}%`}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          fill="transparent"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={`${radius}%`}
          stroke={goal.color || "#C6A87C"}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: index * 0.2 }}
          style={{ 
            filter: `drop-shadow(0 0 8px ${goal.color || "#C6A87C"}44)`,
            strokeLinecap: 'round'
          }}
        />
      </svg>
    </div>
  );
};

const WealthHorizon = () => {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', color: '#C6A87C' });
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/goals/add`, newGoal, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddGoal(false);
      setNewGoal({ title: '', targetAmount: '', color: '#C6A87C' });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative h-full w-full p-8 flex flex-col justify-between overflow-hidden bg-white/[0.01]">
      <header className="flex justify-between items-center relative z-10">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Vector Targets</span>
          <h3 className="text-2xl font-black text-white tracking-tighter">Wealth <span className="text-gold/50">Horizon</span></h3>
        </div>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="p-2 bg-white/5 rounded-xl hover:bg-gold hover:text-darkBg transition-all"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="relative flex-1 flex items-center justify-center my-8">
        <div className="relative w-64 h-64">
          {goals.length > 0 ? (
            <>
              {goals.slice(0, 3).map((goal, i) => (
                <GoalRing key={goal.id} goal={goal} index={i} />
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-textSecondary mb-1">Avg Progress</p>
                <h4 className="text-4xl font-black text-white">
                  {Math.round(goals.reduce((acc, g) => acc + (g.currentAmount/g.targetAmount), 0) / goals.length * 100)}%
                </h4>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30">
              <Target size={48} className="text-gold/50 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-textSecondary">No Vectors Locked</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {goals.slice(0, 2).map(goal => (
          <div key={goal.id} className="glass p-3 flex items-center justify-between group cursor-pointer hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">{goal.title}</p>
                <p className="text-[10px] text-textSecondary">₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-textSecondary group-hover:text-gold transition-colors" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <div className="absolute inset-0 bg-darkBg/95 backdrop-blur-xl z-50 p-8 flex flex-col justify-center">
            <button onClick={() => setShowAddGoal(false)} className="absolute top-6 right-6 text-textSecondary">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Initialize <span className="text-gold">Goal Vector</span></h3>
            <form onSubmit={handleAddGoal} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Objective Name</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Target Quantum (₹)</label>
                <input 
                  type="number" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
                  value={newGoal.targetAmount}
                  onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Vector Color</label>
                <div className="flex gap-3">
                  {['#C6A87C', '#4ade80', '#60a5fa', '#f87171'].map(c => (
                    <button 
                      key={c} type="button"
                      className={`w-8 h-8 rounded-full border-2 ${newGoal.color === c ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewGoal({...newGoal, color: c})}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full btn-premium py-4">Lock Objective</button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WealthHorizon;
