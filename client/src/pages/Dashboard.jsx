import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import TransactionCard from '../components/TransactionCard';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Wallet, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    recentTransactions: [],
    spendingByCategory: [],
    weeklyTrend: [],
    summary: {
      balance: 125000,
      income: 45000,
      expenses: 12000,
      fraudAlerts: 0,
      budgetRemaining: 85
    }
  });

  useEffect(() => {
    // Mock data for demo if API fails
    const fetchData = async () => {
      try {
        const transRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
        const alertsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/fraud/alerts`);
        
        // Process data for charts
        const categories = transRes.data.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

        const pieData = Object.keys(categories).map(name => ({ name, value: categories[name] }));
        
        setData(prev => ({
          ...prev,
          recentTransactions: transRes.data.slice(0, 4),
          spendingByCategory: pieData,
          summary: {
            ...prev.summary,
            fraudAlerts: alertsRes.data.filter(a => a.status === 'pending').length
          }
        }));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#c8a84b', '#4ade80', '#f87171', '#60a5fa', '#a78bfa'];

  return (
    <div className="p-8 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '₹' + data.summary.balance.toLocaleString(), icon: Wallet, color: '#c8a84b' },
          { label: 'Income (Monthly)', value: '₹' + data.summary.income.toLocaleString(), icon: ArrowUpCircle, color: '#4ade80' },
          { label: 'Expenses (Monthly)', value: '₹' + data.summary.expenses.toLocaleString(), icon: ArrowDownCircle, color: '#f87171' },
          { label: 'Fraud Alerts', value: data.summary.fraudAlerts, icon: AlertCircle, color: '#facc15' },
        ].map((card, i) => (
          <div key={i} className="bg-[#112240] p-6 rounded-2xl border border-[#c8a84b] border-opacity-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${card.color}10`, color: card.color }}>
                <card.icon size={24} />
              </div>
            </div>
            <p className="text-[#8892b0] text-sm font-medium">{card.label}</p>
            <h3 className="text-2xl font-bold text-[#e6f1ff]">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Chart */}
        <div className="bg-[#112240] p-6 rounded-2xl border border-[#c8a84b] border-opacity-5">
          <h3 className="text-lg font-bold mb-6">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.spendingByCategory.length > 0 ? data.spendingByCategory : [{name: 'Empty', value: 1}]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid #c8a84b1a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e6f1ff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#112240] p-6 rounded-2xl border border-[#c8a84b] border-opacity-5">
          <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {data.recentTransactions.map((t, i) => (
              <TransactionCard key={i} transaction={t} />
            ))}
            {data.recentTransactions.length === 0 && (
              <p className="text-center text-[#8892b0] py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
