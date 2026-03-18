const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
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

// DB Connection and Sync
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
