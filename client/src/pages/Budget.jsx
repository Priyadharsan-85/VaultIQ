import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import BudgetMeter from '../components/BudgetMeter';
import { Target, PieChart } from 'lucide-react';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills'];

  const fetchData = async () => {
    try {
      const budgetRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/budget`);
      const transRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
      setBudgets(budgetRes.data);
      setTransactions(transRes.data);
    } catch (err) { console.error(err); }
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
      className="p-8 space-y-12"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Financial Targets</h2>
          <p className="text-textSecondary text-sm">Smart allocation and progress monitoring</p>
        </div>
        <div className="flex space-x-2">
           <div className="glass px-4 py-2 flex items-center space-x-2">
            <Target size={18} className="text-gold" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Active Goals</span>
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
              transition={{ delay: i * 0.1 }}
              className="glass-card p-1 pb-6"
            >
              <div className="p-6">
                <BudgetMeter category={cat} spent={spent} limit={limit} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Budget;
