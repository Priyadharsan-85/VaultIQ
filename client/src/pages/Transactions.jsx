import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '',
    merchantName: '',
    category: 'Shopping',
    location: 'Mumbai'
  });

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/add`, newTx);
      setShowModal(false);
      fetchTransactions();
      setNewTx({ amount: '', merchantName: '', category: 'Shopping', location: 'Mumbai' });
    } catch (err) {
      alert('Failed to add transaction');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#c8a84b] text-[#0a1628] px-4 py-2 rounded-xl font-bold hover:bg-[#b6963f] transition-all flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Transaction</span>
        </button>
      </div>

      <div className="bg-[#112240] rounded-2xl border border-[#c8a84b] border-opacity-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a1628] bg-opacity-50 text-[#8892b0] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Merchant</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8a84b] divide-opacity-5">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#c8a84b] hover:bg-opacity-5 transition-colors">
                  <td className="px-6 py-4 font-medium">{t.merchantName}</td>
                  <td className="px-6 py-4 text-[#8892b0]">{t.category}</td>
                  <td className="px-6 py-4 font-bold text-[#e6f1ff]">₹{t.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[#8892b0] text-sm">
                    {new Date(t.transactionTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {t.isFraud ? (
                      <span className="bg-red-500 bg-opacity-10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500 border-opacity-20">Fraud</span>
                    ) : (
                      <span className="bg-green-500 bg-opacity-10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500 border-opacity-20">Safe</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-20 text-[#8892b0]">No transactions found</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0a1628] bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] p-8 rounded-2xl border border-[#c8a84b] border-opacity-20 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Add Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8892b0] mb-1">Merchant</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a1628] border border-[#c8a84b] border-opacity-10 rounded-lg p-3 text-[#e6f1ff] focus:border-opacity-50 outline-none"
                  value={newTx.merchantName}
                  onChange={e => setNewTx({...newTx, merchantName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8892b0] mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#0a1628] border border-[#c8a84b] border-opacity-10 rounded-lg p-3 text-[#e6f1ff]"
                    value={newTx.amount}
                    onChange={e => setNewTx({...newTx, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8892b0] mb-1">Category</label>
                  <select
                    className="w-full bg-[#0a1628] border border-[#c8a84b] border-opacity-10 rounded-lg p-3 text-[#e6f1ff]"
                    value={newTx.category}
                    onChange={e => setNewTx({...newTx, category: e.target.value})}
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-[#8892b0]">Cancel</button>
                <button type="submit" className="flex-1 bg-[#c8a84b] text-[#0a1628] py-3 rounded-xl font-bold hover:bg-[#b6963f] transition-all">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
