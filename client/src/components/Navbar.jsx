import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Bell, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="h-20 glass m-4 mb-0 flex items-center justify-between px-8 z-40 border-0">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        <Sparkles size={24} className="text-gold animate-pulse" />
        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gold to-white uppercase tracking-tighter">
          VAULT<span className="text-gold">IQ</span>
        </span>
      </motion.div>

      <div className="flex items-center space-x-6">
        <button className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl text-textSecondary hover:text-gold transition-all">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
        </button>

        {user ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-4 bg-white/5 pl-4 pr-1 py-1 rounded-2xl border border-white/5"
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-textPrimary">{user.name}</span>
              <span className="text-[10px] text-gold font-black uppercase tracking-widest">Premium Pro</span>
            </div>
            <button 
              onClick={logout}
              className="p-3 bg-white/10 hover:bg-red-500/20 text-textSecondary hover:text-red-400 rounded-xl transition-all"
            >
              <LogOut size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-textSecondary hover:text-gold transition-colors">Login</Link>
            <Link to="/register" className="btn-premium py-2 text-sm shadow-gold/20">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
