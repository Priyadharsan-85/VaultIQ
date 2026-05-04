import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ShieldCheck, Wallet, ArrowUpRight, Plus, 
  CreditCard, Send, Lock, Zap
} from 'lucide-react';

import BentoCard from '../components/BentoCard';
import WealthHorizon from '../components/WealthHorizon';
import ThreeDCard from '../components/ThreeDCard';
import CashRunway from '../components/CashRunway';
import SubscriptionCalendar from '../components/SubscriptionCalendar';
import IndianBankConnect from '../components/IndianBankConnect';

import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlySpending: 0,
    fraudAlerts: 0,
    commitments: 0,
    monthlyIncome: 0,
    savingsRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('Analyzing your financial flow...');
  const [isLocked, setIsLocked] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transferData, setTransferData] = useState({ to: '', amount: '' });
  const [refreshingInsight, setRefreshingInsight] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/stats`);
      setStats({
        totalBalance: res.data.totalBalance,
        monthlySpending: res.data.monthlySpending,
        fraudAlerts: res.data.fraudAlerts,
        commitments: res.data.totalCommitments,
        monthlyIncome: res.data.monthlyIncome,
        savingsRate: res.data.savingsRate
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    setRefreshingInsight(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai/insight`);
      setInsight(res.data.insight);
    } catch (err) { 
      console.error(err); 
    } finally {
      setRefreshingInsight(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchInsight();
  }, []);

  const handleTransfer = (e) => {
    e.preventDefault();
    alert(`Initiating secure transfer of ₹${transferData.amount} to Node ${transferData.to}... Connection established.`);
    setShowTransferModal(false);
    setTransferData({ to: '', amount: '' });
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Create a special transaction for top-up
      await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/add`, {
        amount: parseFloat(topUpAmount),
        merchantName: 'NexaGuard Top-Up',
        category: 'Income',
        location: 'System'
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setShowTopUpModal(false);
      setTopUpAmount('');
      fetchStats();
      alert('Quantum influx successful. Balance updated.');
    } catch (err) {
      alert('Influx failed. Check system connection.');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header Section (Human Feel) */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
            Commander Overview
          </span>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            System <span className="text-gold/50">Pulse</span>
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-textSecondary text-xs font-medium uppercase tracking-widest">Global Status</p>
          <div className="flex items-center gap-2 text-success font-bold text-sm">
            Operational <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-12 gap-6">
        
        {/* Total Balance (Monolith) */}
        <BentoCard spanCols={2} spanRows={4} className="bg-gradient-to-br from-gold/10 to-transparent">
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 shadow-[0_0_20px_rgba(200,168,75,0.1)]">
                  <Wallet size={28} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowTopUpModal(true)}
                    className="p-2 bg-white/5 rounded-xl hover:bg-gold/20 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={fetchInsight}
                    className={`p-2 bg-white/5 rounded-xl hover:bg-gold/20 transition-colors ${refreshingInsight ? 'animate-spin text-gold' : ''}`}
                  >
                    <Zap size={18} />
                  </button>
                </div>
              </div>
              <p className="text-textSecondary text-xs font-bold uppercase tracking-[0.2em] mb-2">Network Balance</p>
              <h2 className="text-6xl font-black text-white tracking-tight">
                ₹{stats.totalBalance.toLocaleString()}
              </h2>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-darkBg bg-muted flex items-center justify-center text-[10px] font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-textSecondary text-[10px] font-medium">Shared across 3 interconnected vaults</p>
            </div>
          </div>
        </BentoCard>

        {/* Plaid Bank Connection */}
        <BentoCard spanCols={2} spanRows={2}>
          <div className="h-full flex flex-col justify-center">
            <IndianBankConnect onSyncSuccess={() => {
              fetchStats();
              fetchInsight();
            }} />
          </div>
        </BentoCard>

        {/* Wealth Horizon (Unique Feature) */}
        <BentoCard spanCols={2} spanRows={4}>
          <WealthHorizon />
        </BentoCard>

        {/* Cash Runway Chart */}
        <BentoCard spanCols={3} spanRows={5}>
          <div className="p-8 h-full flex flex-col min-h-[450px]">
            <CashRunway />
          </div>
        </BentoCard>

        {/* High Tech Card Status */}
        <BentoCard spanCols={1} spanRows={5} className="bg-muted/50">
          <div className="p-6 h-full flex flex-col justify-between">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 mb-4">Active Cipher Card</h3>
            <div className="scale-90 origin-top">
              <ThreeDCard />
            </div>
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
                <span className="text-textSecondary">Status</span>
                <span className="text-success font-bold flex items-center gap-1"><ShieldCheck size={12}/> Shield Active</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-textSecondary">Limit</span>
                <span className="text-white font-mono">₹5,00,000</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Quick Action Tiles */}
        <BentoCard 
          spanCols={1} spanRows={3} 
          className="hover:bg-gold/20 cursor-pointer group"
          onClick={() => setShowTransferModal(true)}
        >
          <div className="p-6 flex flex-col justify-center items-center h-full text-center">
            <div className="mb-4 p-3 bg-gold/10 rounded-full group-hover:scale-110 transition-transform duration-500">
              <Send size={24} className="text-gold" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Transfer</h4>
            <p className="text-[10px] text-textSecondary uppercase tracking-widest">Instant Node</p>
          </div>
        </BentoCard>

        <BentoCard 
          spanCols={1} spanRows={3} 
          className={`cursor-pointer group transition-all duration-500 ${isLocked ? 'bg-red-500/20 border-red-500/50' : 'hover:bg-red-500/10 border-red-500/20'}`}
          onClick={() => setIsLocked(!isLocked)}
        >
          <div className="p-6 flex flex-col justify-center items-center h-full text-center">
            <div className={`mb-4 p-3 rounded-full transition-all duration-500 ${isLocked ? 'bg-red-500 text-white scale-110 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white'}`}>
              <Lock size={24} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{isLocked ? 'Vault Secured' : 'Vault Lock'}</h4>
            <p className={`text-[10px] uppercase tracking-widest font-black ${isLocked ? 'text-red-400' : 'text-red-500/50'}`}>
              {isLocked ? 'SHIELD ACTIVE' : 'EMERGENCY'}
            </p>
          </div>
        </BentoCard>

        <BentoCard spanCols={2} spanRows={3}>
           <div className="p-6 flex h-full items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <CreditCard size={32} className="text-textSecondary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white italic">"{insight}"</h4>
                <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Zap size={10} /> AI Insight Alpha-9
                </p>
              </div>
           </div>
        </BentoCard>

        {/* Subscription Calendar */}
        <BentoCard spanCols={4} spanRows={12}>
          <div className="p-8">
            <SubscriptionCalendar />
          </div>
        </BentoCard>

      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-10 w-full max-w-md relative"
          >
            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Quantum <span className="text-gold/50">Influx</span></h3>
            <form onSubmit={handleTopUp} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Amount to Inject (₹)</label>
                <input 
                  type="number" required placeholder="50000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 text-xs font-black uppercase text-textSecondary">Cancel</button>
                <button type="submit" className="flex-[2] btn-premium py-4">Confirm Influx</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {showTransferModal && (
        <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-10 w-full max-w-md relative"
          >
            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Initiate <span className="text-gold/50">Node Transfer</span></h3>
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Destination Node</label>
                <input 
                  type="text" required placeholder="0x... or Wallet ID"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
                  value={transferData.to}
                  onChange={e => setTransferData({...transferData, to: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-textSecondary mb-2 block">Quantum (₹)</label>
                <input 
                  type="number" required placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold outline-none"
                  value={transferData.amount}
                  onChange={e => setTransferData({...transferData, amount: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 text-xs font-black uppercase text-textSecondary">Abort</button>
                <button type="submit" className="flex-[2] btn-premium py-4">Execute Transfer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
