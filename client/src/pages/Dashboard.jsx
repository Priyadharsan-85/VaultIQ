import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';
import ThreeDCard from '../components/ThreeDCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBalance: 125400,
    monthlySpending: 45200,
    fraudAlerts: 0,
    savingsRate: 24
  });

  const chartData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 5000 },
    { name: 'Thu', amount: 2780 },
    { name: 'Fri', amount: 1890 },
    { name: 'Sat', amount: 2390 },
    { name: 'Sun', amount: 3490 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Stats & 3D Card */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="glass-card p-8 group overflow-hidden relative">
              <div className="neon-glow" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gold/10 rounded-xl text-gold"><Wallet size={24} /></div>
                  <span className="text-success flex items-center text-xs font-bold bg-success/10 px-2 py-1 rounded-full">
                    +12% <ArrowUpRight size={14} />
                  </span>
                </div>
                <p className="text-textSecondary text-sm font-bold uppercase tracking-widest mb-1">Total Balance</p>
                <h3 className="text-4xl font-black text-white">₹{stats.totalBalance.toLocaleString()}</h3>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-card p-8 border-l-4 border-l-gold">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><TrendingUp size={24} /></div>
              </div>
              <p className="text-textSecondary text-sm font-bold uppercase tracking-widest mb-1">Monthly Spent</p>
              <h3 className="text-4xl font-black text-white">₹{stats.monthlySpending.toLocaleString()}</h3>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="glass-card p-8 h-[400px]">
            <h3 className="text-xl font-bold mb-8">Cash Flow Analysis</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c8a84b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c8a84b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#c8a84b' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#c8a84b" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Side: 3D Highlighting */}
        <motion.div variants={itemVariants} className="lg:w-96 space-y-8">
          <div className="glass-card p-8 bg-gradient-to-br from-gold/20 to-transparent border-gold/20">
            <h3 className="text-sm font-black uppercase tracking-widest text-gold mb-4 text-center">Your Intelligent Vault</h3>
            <ThreeDCard />
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Security Status</span>
                <span className="text-success font-bold flex items-center gap-1"><ShieldCheck size={16}/> Encrypted</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-textSecondary">Card Number</span>
                <span className="text-white font-mono">**** 8842</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
              Recent Insights
            </h4>
            <div className="space-y-4 text-sm text-textSecondary italic">
              "Your spending in **Food** is 15% lower than last month. Great job!"
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
