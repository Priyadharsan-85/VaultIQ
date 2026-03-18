import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketTicker from '../components/MarketTicker';
import { RefreshCcw } from 'lucide-react';

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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market Intelligence</h2>
        <button 
          onClick={fetchData}
          className={`p-2 rounded-lg bg-[#112240] text-[#c8a84b] hover:bg-[#1a365d] transition-all ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <section>
        <h3 className="text-[#8892b0] text-sm font-bold uppercase tracking-widest mb-4">Cryptocurrency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {crypto.map((coin) => (
            <MarketTicker key={coin.id} data={coin} type="crypto" />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[#8892b0] text-sm font-bold uppercase tracking-widest mb-4">Stocks (Top Tech)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stocks.map((stock, i) => (
            <MarketTicker key={i} data={stock} type="stock" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Market;
