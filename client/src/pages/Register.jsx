import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import AuroraBackground from '../components/AuroraBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 relative z-10 border-white/10"
      >
        <div className="text-center mb-8">
           <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-gold to-goldHover rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-gold/30"
          >
            <UserPlus size={32} className="text-darkBg" />
          </motion.div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Join VaultIQ</h2>
          <p className="text-textSecondary text-sm font-medium">Create your secure financial intelligence profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Full Legal Name</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-gold/50 focus:outline-none text-white transition-all"
              placeholder="John D. Elite" required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Email Identifier</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-gold/50 focus:outline-none text-white transition-all"
              placeholder="name@nexus.com" required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-textSecondary tracking-[0.2em]">Create Secure Key</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-gold/50 focus:outline-none text-white transition-all"
              placeholder="••••••••" required
            />
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-textSecondary font-bold py-2">
            <ShieldCheck size={14} className="text-gold" />
            <span>256-BIT ENCRYPTION ENABLED</span>
          </div>

          <button 
            type="submit"
            className="group w-full btn-premium py-5 text-sm flex items-center justify-center space-x-2"
          >
            <span>Activate Account</span>
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-textSecondary text-sm font-bold">
          Already a member? <Link to="/login" className="text-gold hover:underline">Sign in now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
