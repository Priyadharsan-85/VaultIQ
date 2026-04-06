const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
const associations = require('./models/associations');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/fraud', require('./routes/fraud'));
app.use('/api/market', require('./routes/market'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/ai', require('./routes/ai'));

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// DB Connection and Sync
sequelize.sync().then(() => {
  console.log('✅ Database synced successfully');
  const server = app.listen(PORT, () => {
    console.log(`🚀 AI Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
  });

  // Keep-alive for nodemon/agent stability
  setInterval(() => {
    if (server && server.listening) {
      // Keep process alive
    }
  }, 1000);

}).catch(err => {
  console.error('❌ Failed to sync database:', err);
});
