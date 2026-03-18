import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ReceiptText, ShieldAlert, TrendingUp, WalletCards } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Fraud Alerts', path: '/fraud', icon: ShieldAlert },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'Budget', path: '/budget', icon: WalletCards },
  ];

  return (
    <aside className="w-72 glass h-[calc(100vh-2rem)] m-4 border-r-0 py-8 flex flex-col z-50">
      <div className="px-8 mb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-goldHover flex items-center justify-center shadow-2xl shadow-gold/20"
        >
          <WalletCards size={32} className="text-darkBg" />
        </motion.div>
      </div>
      
      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={item.path}
                className={`group relative flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg shadow-gold/5' 
                  : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'
                }`}
              >
                {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1.5 h-6 bg-gold rounded-full" />}
                <Icon size={22} className={isActive ? 'text-gold' : 'group-hover:text-gold transition-colors'} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-textSecondary mb-2">VaultIQ Account</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gold">Premium Pro</span>
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-glow"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
