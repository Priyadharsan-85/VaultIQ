import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, ArrowDownNarrowWide, X } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '', merchantName: '', category: 'Shopping', location: 'Mumbai'
  });

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
      setTransactions(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/add`, newTx);
      setShowModal(false);
      fetchTransactions();
      setNewTx({ amount: '', merchantName: '', category: 'Shopping', location: 'Mumbai' });
    } catch (err) { alert('Failed to add transaction'); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Transactions</h2>
          <p className="text-textSecondary text-sm">Review and manage your detailed history</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-premium flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Record</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input type="text" placeholder="Search merchants..." className="bg-darkBg/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold/50 outline-none w-64 transition-all" />
            </div>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-textSecondary"><Filter size={18}/></button>
          </div>
          <button className="text-xs font-bold text-gold flex items-center gap-1 hover:underline">Download CSV <ArrowDownNarrowWide size={14}/></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-textSecondary text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-4">Merchant & Category</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t, i) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 group transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold">
                        {t.merchantName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-gold transition-colors">{t.merchantName}</p>
                        <p className="text-xs text-textSecondary">{t.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-lg font-black text-white">₹{t.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    {t.isFraud ? (
                      <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">Anomalous</span>
                    ) : (
                      <span className="bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-success/20">Verified</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right text-textSecondary text-sm font-medium">
                    {new Date(t.transactionTime).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-textSecondary hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-black mb-6">Add Transaction</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-black text-textSecondary tracking-widest mb-2">Merchant Name</label>
                  <input
                    type="text" required
                    className="w-full bg-darkBg/50 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 outline-none"
                    value={newTx.merchantName}
                    onChange={e => setNewTx({...newTx, merchantName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-textSecondary tracking-widest mb-2">Amount (₹)</label>
                    <input
                      type="number" required
                      className="w-full bg-darkBg/50 border border-white/10 rounded-xl p-4 text-white"
                      value={newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-textSecondary tracking-widest mb-2">Category</label>
                    <select
                      className="w-full bg-darkBg/50 border border-white/10 rounded-xl p-4 text-white"
                      value={newTx.category}
                      onChange={e => setNewTx({...newTx, category: e.target.value})}
                    >
                      <option value="Shopping">Shopping</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Bills">Bills</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 font-bold text-textSecondary hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-premium">Save Record</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transactions;
