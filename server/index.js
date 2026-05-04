const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
const associations = require('./models/associations');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/fraud', require('./routes/fraud'));
app.use('/api/market', require('./routes/market'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/setu', require('./routes/setu'));

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

}).catch(err => {
  console.error('❌ Failed to sync database:', err);
});
