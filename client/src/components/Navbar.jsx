import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-[#112240] border-b border-[#c8a84b] border-opacity-10 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-[#c8a84b] tracking-wider">VAULT<span className="text-[#e6f1ff]">IQ</span></h1>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-3 text-[#e6f1ff]">
              <div className="w-8 h-8 rounded-full bg-[#c8a84b] bg-opacity-20 flex items-center justify-center border border-[#c8a84b] border-opacity-30">
                <UserIcon size={16} className="text-[#c8a84b]" />
              </div>
              <span className="text-sm font-medium">Hello, {user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 bg-opacity-10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500 border-opacity-20 hover:bg-opacity-20 transition-all text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-[#8892b0] hover:text-[#c8a84b] transition-colors text-sm font-medium">Login</Link>
            <Link to="/register" className="bg-[#c8a84b] text-[#0a1628] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#b6963f] transition-all">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
