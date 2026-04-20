import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Bell, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-24 flex items-center justify-between px-10 z-40 relative">
      {/* Decorative Blur Trace */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-gold/5 blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-3 group cursor-pointer"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gold/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkles size={26} className="text-gold group-hover:rotate-12 transition-transform duration-500" />
        </div>
        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gold via-white/90 to-white uppercase tracking-tighter">
          VAULT<span className="text-gold">IQ</span>
        </span>
      </motion.div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
           <button className="p-3 bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-gold/5 rounded-2xl text-textSecondary hover:text-gold transition-all duration-500">
            <Bell size={20} />
          </button>
        </div>

        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/5 pl-5 pr-1 py-1 rounded-[1.5rem] hover:bg-white/[0.05] transition-colors duration-500"
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-textPrimary tracking-tight">{user.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#c8a84b]" />
                <span className="text-[9px] text-gold font-black uppercase tracking-[0.2em]">Alpha-Node Active</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-3.5 bg-white/5 hover:bg-red-500 hover:text-white text-textSecondary rounded-[1.1rem] transition-all duration-500 shadow-2xl"
            >
              <LogOut size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-textSecondary hover:text-white transition-colors">Commander Access</Link>
            <Link to="/register" className="btn-premium py-3 px-8 text-xs shadow-gold/40">Initialize Vault</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
