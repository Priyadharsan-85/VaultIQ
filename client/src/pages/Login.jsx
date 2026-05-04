import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, WalletCards } from 'lucide-react';
import AuroraBackground from '../components/AuroraBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-10 relative z-10 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-16 h-16 bg-gradient-to-br from-gold to-goldHover rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-gold/30"
          >
            <WalletCards size={32} className="text-darkBg" />
          </motion.div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back</h2>
          <p className="text-textSecondary text-sm font-medium">Access your intelligent financial vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Email Address</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-gold/50 focus:outline-none text-white transition-all placeholder:text-textSecondary/30"
              placeholder="name@nexus.com" required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-gold/50 focus:outline-none text-white transition-all placeholder:text-textSecondary/30"
              placeholder="••••••••" required
            />
          </div>

          <button 
            type="submit"
            className="group w-full btn-premium py-5 text-sm flex items-center justify-center space-x-2"
          >
            <span>Initialize Session</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-textSecondary text-sm font-bold">
          New to NexaGuard? <Link to="/register" className="text-gold hover:underline">Create a free account</Link>
        </p>
      </motion.div>

      {/* Decorative Orbs */}
      <div className="fixed top-[10%] left-[15%] w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-[10%] right-[15%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Login;
