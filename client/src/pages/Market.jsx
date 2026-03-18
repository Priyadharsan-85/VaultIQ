import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MarketTicker from '../components/MarketTicker';
import { RefreshCcw, TrendingUp, Cpu, Coins } from 'lucide-react';

const Market = () => {
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cryptoRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/market/crypto`);
      const stocksRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/market/stocks`);
      setCrypto(cryptoRes.data);
      setStocks(stocksRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-12"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Market Intelligence</h2>
          <p className="text-textSecondary text-sm">Real-time asset tracking and sentiment analysis</p>
        </div>
        <button 
          onClick={fetchData}
          className={`p-4 glass hover:bg-white/10 text-gold transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-gold">
          <Coins size={20} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Cryptocurrency (Top Assets)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {crypto.map((coin, i) => (
            <motion.div 
              key={coin.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <MarketTicker data={coin} type="crypto" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-gold">
          <Cpu size={20} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Equity Markets (Tech Index)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stocks.map((stock, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: (i + 5) * 0.1 }}
            >
              <MarketTicker data={stock} type="stock" />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Market;
