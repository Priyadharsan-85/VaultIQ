const axios = require('axios');
require('dotenv').config();

exports.getCrypto = async (req, res) => {
  try {
    const coins = 'bitcoin,ethereum,solana,cardano,dogecoin';
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/coins/markets`, {
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
    res.json(response.data);
  } catch (err) {
    console.error('CoinGecko Error:', err.message);
    res.status(500).json({ message: 'Error fetching crypto data' });
  }
};

exports.getStocks = async (req, res) => {
  try {
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
    res.json(stocksData);
  } catch (err) {
    console.error('AlphaVantage Error:', err.message);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
};
