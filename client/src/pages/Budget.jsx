import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import BudgetMeter from '../components/BudgetMeter';
import { Target, X } from 'lucide-react';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  
  const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills'];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const budgetRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const transRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgetRes.data);
      setTransactions(transRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/budget/set`, {
        category: selectedCategory,
        monthlyLimit: parseFloat(newLimit),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setShowModal(false);
      setNewLimit('');
      fetchData();
      alert(`Budget for ${selectedCategory} locked successfully.`);
    } catch (err) {
      alert('Failed to set budget. Connection error.');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getSpentForCategory = (cat) => {
    return transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 lg:p-12 space-y-12"
    >
      <div className="flex justify-between items-end">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Resource Allocation</span>
          <h2 className="text-4xl font-black text-white tracking-tighter">Financial <span className="text-gold/50">Targets</span></h2>
          <p className="text-textSecondary text-sm font-medium mt-2">Smart monitoring of your quantum spending across nodes.</p>
        </div>
        <div className="flex space-x-2">
           <div className="glass px-6 py-3 flex items-center space-x-3 border-white/10">
            <Target size={20} className="text-gold" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Vectors</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => {
          const b = budgets.find(item => item.category === cat);
          const spent = getSpentForCategory(cat);
          const limit = b ? b.monthlyLimit : 10000;
          
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-1 pb-6 cursor-pointer group"
              onClick={() => {
                setSelectedCategory(cat);
                setNewLimit(limit.toString());
                setShowModal(true);
              }}
            >
              <div className="p-6">
                <BudgetMeter category={cat} spent={spent} limit={limit} />
                <div className="mt-4 text-[10px] text-gold/40 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to reconfigure vector
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass p-10 w-full max-w-md relative border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-textSecondary hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Set <span className="text-gold/50">Budget Vector</span></h3>
              <p className="text-textSecondary text-[10px] uppercase font-black tracking-[0.2em] mb-8">Protocol: {selectedCategory}</p>
              
              <form onSubmit={handleSetBudget} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Monthly Limit (₹)</label>
                  <input 
                    type="number" required placeholder="15000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-gold outline-none transition-all"
                    value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-textSecondary">Abort</button>
                  <button type="submit" className="flex-[2] btn-premium py-5">Lock Budget</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Budget;
