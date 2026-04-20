const axios = require('axios');
require('dotenv').config();

let cryptoCache = { data: null, timestamp: 0 };
let stockCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 60 * 1000; // 60 seconds

exports.getCrypto = async (req, res) => {
  try {
    const now = Date.now();
    if (cryptoCache.data && (now - cryptoCache.timestamp < CACHE_DURATION)) {
      console.log('Serving Crypto from Cache');
      return res.json(cryptoCache.data);
    }

    const coins = 'bitcoin,ethereum,solana,cardano,dogecoin';
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coins,
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });

    cryptoCache = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (err) {
    console.error('CoinGecko Error:', err.message);
    res.status(500).json({ message: 'Error fetching crypto data' });
  }
};

exports.getStocks = async (req, res) => {
  try {
    const now = Date.now();
    if (stockCache.data && (now - stockCache.timestamp < CACHE_DURATION)) {
      console.log('Serving Stocks from Cache');
      return res.json(stockCache.data);
    }

    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    const stocksData = await Promise.all(symbols.map(async (symbol) => {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: process.env.ALPHA_VANTAGE_API_KEY
        }
      });
      return response.data['Global Quote'];
    }));

    stockCache = { data: stocksData, timestamp: now };
    res.json(stocksData);
  } catch (err) {
    console.error('AlphaVantage Error:', err.message);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
};
