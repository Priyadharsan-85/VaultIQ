import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <aside className="w-64 bg-[#112240] h-screen border-r border-[#c8a84b] border-opacity-10 py-8 flex flex-col">
      <div className="px-8 mb-10">
        <div className="w-12 h-12 rounded-xl bg-[#c8a84b] flex items-center justify-center shadow-lg shadow-[#c8a84b1a]">
          <WalletCards size={28} className="text-[#0a1628]" />
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-[#c8a84b] bg-opacity-10 text-[#c8a84b] border border-[#c8a84b] border-opacity-20' 
                : 'text-[#8892b0] hover:text-[#e6f1ff] hover:bg-[#c8a84b] hover:bg-opacity-5'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-8 mt-auto">
        <div className="p-4 rounded-xl bg-[#0a1628] border border-[#c8a84b] border-opacity-10">
          <p className="text-[10px] uppercase tracking-widest text-[#8892b0] mb-1">Current Plan</p>
          <p className="text-xs font-bold text-[#c8a84b]">VaultIQ Pro</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
