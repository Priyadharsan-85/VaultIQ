import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ReceiptText, ShieldAlert, TrendingUp, WalletCards } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Ledger', path: '/transactions', icon: ReceiptText },
    { name: 'Security', path: '/fraud', icon: ShieldAlert },
    { name: 'Exchange', path: '/market', icon: TrendingUp },
    { name: 'Treasurer', path: '/budget', icon: WalletCards },
  ];

  return (
    <aside className="w-80 h-full p-4 flex flex-col z-50">
      <div className="glass h-full w-full rounded-[2.5rem] py-10 flex flex-col border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        
        <div className="px-10 mb-16 relative z-10">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-gold to-accent flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(200,168,75,0.3)]"
          >
            <WalletCards size={32} className="text-darkBg" />
          </motion.div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 relative z-10">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.name}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={item.path}
                  className={`group relative flex items-center py-4 px-6 rounded-2xl transition-all duration-500 ${
                    isActive 
                    ? 'text-white' 
                    : 'text-textSecondary hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl -z-10 shadow-inner"
                    />
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTracer"
                      className="absolute left-0 w-1 h-6 bg-gold rounded-full"
                    />
                  )}
                  <Icon size={20} className={`mr-4 transition-colors duration-500 ${isActive ? 'text-gold' : 'group-hover:text-gold/70'}`} />
                  <span className={`text-sm font-black tracking-tight transition-all ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="px-8 mt-auto relative z-10">
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl group cursor-pointer hover:bg-white/[0.04] transition-colors duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <TrendingUp size={14} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-textSecondary">Vault Status</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Tier: Sovereign</span>
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_10px_#c8a84b]"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
