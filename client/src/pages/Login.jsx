import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] px-4">
      <div className="max-w-md w-full bg-[#112240] p-8 rounded-2xl border border-[#c8a84b] border-opacity-20 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#c8a84b] text-center mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#8892b0] mb-2 text-sm">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a1628] border border-[#c8a84b] border-opacity-10 rounded-xl focus:border-opacity-100 focus:outline-none text-[#e6f1ff] transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[#8892b0] mb-2 text-sm">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a1628] border border-[#c8a84b] border-opacity-10 rounded-xl focus:border-opacity-100 focus:outline-none text-[#e6f1ff] transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-[#c8a84b] text-[#0a1628] font-bold rounded-xl hover:bg-[#b6963f] transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-[#8892b0] text-sm">
          Don't have an account? <Link to="/register" className="text-[#c8a84b] hover:underline">Create one now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
