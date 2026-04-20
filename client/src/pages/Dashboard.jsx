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

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 5000 },
    { name: 'Thu', amount: 2780 },
    { name: 'Fri', amount: 1890 },
    { name: 'Sat', amount: 2390 },
    { name: 'Sun', amount: 3490 },
  ];

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
                  <button className="p-2 bg-white/5 rounded-xl hover:bg-gold/20 transition-colors">
                    <Plus size={18} />
                  </button>
                  <button className="p-2 bg-white/5 rounded-xl hover:bg-gold/20 transition-colors">
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

        {/* Wealth Horizon (Unique Feature) */}
        <BentoCard spanCols={2} spanRows={4}>
          <WealthHorizon balance={stats.totalBalance} commitments={stats.commitments} />
        </BentoCard>

        {/* Cash Flow Chart */}
        <BentoCard spanCols={3} spanRows={5}>
          <div className="p-8 h-full flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Liquidity Stream</h3>
              <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                <span className="text-gold">Weekly</span>
                <span className="hover:text-white cursor-pointer px-2">Monthly</span>
                <span className="hover:text-white cursor-pointer px-2">Yearly</span>
              </div>
            </div>
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorStream" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#c8a84b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#04060e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                    cursor={{ stroke: '#c8a84b33', strokeWidth: 2 }}
                  />
                  <Area 
                    type="natural" 
                    dataKey="amount" 
                    stroke="#c8a84b" 
                    strokeWidth={4} 
                    fill="url(#colorStream)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
        <BentoCard spanCols={1} spanRows={3} className="hover:bg-gold/20 cursor-pointer group">
          <div className="p-6 flex flex-col justify-center items-center h-full text-center">
            <div className="mb-4 p-3 bg-gold/10 rounded-full group-hover:scale-110 transition-transform duration-500">
              <Send size={24} className="text-gold" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Transfer</h4>
            <p className="text-[10px] text-textSecondary uppercase tracking-widest">Instant Node</p>
          </div>
        </BentoCard>

        <BentoCard spanCols={1} spanRows={3} className="hover:bg-red-500/10 cursor-pointer group border-red-500/20">
          <div className="p-6 flex flex-col justify-center items-center h-full text-center">
            <div className="mb-4 p-3 bg-red-500/10 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
              <Lock size={24} className="text-red-400 group-hover:text-white" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Vault Lock</h4>
            <p className="text-[10px] text-textSecondary uppercase tracking-widest text-red-500/50 font-black">Emergency</p>
          </div>
        </BentoCard>

        <BentoCard spanCols={2} spanRows={3}>
           <div className="p-6 flex h-full items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <CreditCard size={32} className="text-textSecondary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white italic">"Spending in **Entertainment** is 12% lower than usual. You're in control."</h4>
                <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                  <Zap size={10} /> AI Insight Alpha-9
                </p>
              </div>
           </div>
        </BentoCard>

      </div>
    </div>
  );
};

export default Dashboard;
