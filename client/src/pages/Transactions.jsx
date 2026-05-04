import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, ArrowDownNarrowWide, X, Calendar, MapPin, Tag, Camera } from 'lucide-react';
import ReceiptScanner from '../components/ReceiptScanner';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '', merchantName: '', category: 'Shopping', location: 'Mumbai'
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
        params: { search, category }
      });
      setTransactions(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/add`, newTx);
      setShowModal(false);
      fetchTransactions();
      setNewTx({ amount: '', merchantName: '', category: 'Shopping', location: 'Mumbai' });
    } catch (err) { alert('Failed to add transaction'); }
  };

  const handleExport = () => {
    if (transactions.length === 0) return alert('No data to export');
    
    const headers = ['ID', 'Merchant', 'Amount', 'Category', 'Location', 'Date', 'Status'];
    const csvRows = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        `"${t.merchantName}"`,
        t.amount,
        t.category,
        t.location,
        new Date(t.transactionTime).toLocaleDateString(),
        t.isFraud ? 'Anomalous' : 'Verified'
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `NexaGuard_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-10 max-w-[1400px] mx-auto"
    >
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Archive Ledger</span>
          <h1 className="text-4xl font-black text-white tracking-tighter">Transaction <span className="text-gold/50">History</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Query merchant..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:border-gold/30 outline-none w-64 lg:w-80 transition-all duration-500 hover:bg-white/[0.05]" 
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowScannerModal(true)}
              className="btn-premium flex items-center gap-3 !bg-white/5 !text-white hover:!bg-gold hover:!text-darkBg border border-white/10"
            >
              <Camera size={20} />
              <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Scan Receipt</span>
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-premium flex items-center gap-3"
            >
              <Plus size={20} />
              <span className="font-black text-xs uppercase tracking-widest">New Entry</span>
            </button>
          </div>
        </div>
      </header>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex gap-3">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-gold/10 rounded-xl text-xs font-bold text-textSecondary hover:text-gold transition-all outline-none border-none appearance-none"
              >
                <option value="All">All Categories</option>
                <option value="Shopping">Shopping</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-gold/10 rounded-xl text-xs font-bold text-textSecondary hover:text-gold transition-all">
               <Calendar size={14}/> Last 30 Days
              </button>
           </div>
           <button 
            onClick={handleExport}
            className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2 hover:opacity-70 transition-opacity"
           >
            Export Dataset <ArrowDownNarrowWide size={14}/>
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-textSecondary">
                <th className="px-10 py-5">Origin / Class</th>
                <th className="px-10 py-5">Quantum (₹)</th>
                <th className="px-10 py-5">Verification</th>
                <th className="px-10 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {transactions.map((t, i) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="hover:bg-gold/[0.02] group transition-all duration-500"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold font-black group-hover:scale-110 group-hover:border-gold/20 transition-all duration-500">
                        {t.merchantName[0]}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg tracking-tight group-hover:text-gold transition-colors">{t.merchantName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[10px] uppercase font-black text-textSecondary/60"><Tag size={10} /> {t.category}</span>
                          <span className="text-white/10 text-xs">•</span>
                          <span className="flex items-center gap-1 text-[10px] uppercase font-black text-textSecondary/60"><MapPin size={10} /> {t.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xl font-black text-white group-hover:tracking-widest transition-all duration-700">₹{t.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6">
                    {t.isFraud ? (
                      <div className="flex items-center gap-2 py-1 px-3 bg-red-500/10 text-red-400 rounded-full w-fit border border-red-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Anomalous</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1 px-3 bg-success/10 text-success rounded-full w-fit border border-success/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <p className="text-white font-black text-xs tracking-widest">{new Date(t.transactionTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-[10px] text-textSecondary font-medium mt-1">Ref: {t.id.toString().substring(0, 8)}</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="glass p-10 w-full max-w-xl relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-textSecondary hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-10">
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Secure Input</span>
                <h3 className="text-3xl font-black text-white tracking-tighter">Register <span className="text-gold/50">Flux</span></h3>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="space-y-6">
                   <div className="relative group">
                    <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em] mb-4 block group-focus-within:text-gold transition-colors">Merchant Designation</label>
                    <input
                      type="text" required
                      placeholder="e.g. Amazon Services"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:border-gold/50 outline-none transition-all duration-500"
                      value={newTx.merchantName}
                      onChange={e => setNewTx({...newTx, merchantName: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em] mb-4 block">Quantum (₹)</label>
                      <input
                        type="number" required
                        placeholder="0.00"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white focus:border-gold/50 outline-none transition-all duration-500"
                        value={newTx.amount}
                        onChange={e => setNewTx({...newTx, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em] mb-4 block">Classification</label>
                      <div className="relative">
                        <select
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white focus:border-gold/50 outline-none appearance-none transition-all duration-500"
                          value={newTx.category}
                          onChange={e => setNewTx({...newTx, category: e.target.value})}
                        >
                          <option value="Shopping">Shopping</option>
                          <option value="Food">Food</option>
                          <option value="Travel">Travel</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Bills">Bills</option>
                        </select>
                        <Plus size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 pt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 font-black text-xs uppercase tracking-widest text-textSecondary hover:text-white transition-colors">Abort</button>
                  <button type="submit" className="flex-[2] btn-premium py-5">Commit Ledger Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScannerModal && (
          <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="glass p-10 w-full max-w-xl relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <ReceiptScanner 
                onClose={() => setShowScannerModal(false)} 
                onScanComplete={(newTx) => {
                  setShowScannerModal(false);
                  fetchTransactions(); // Refresh the list
                  // Optional: Show a toast notification here
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transactions;
