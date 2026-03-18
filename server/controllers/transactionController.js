const Transaction = require('../models/Transaction');
const axios = require('axios');
require('dotenv').config();

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { amount, merchantName, category, location, transactionTime } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      merchantName,
      category,
      location,
      transactionTime: transactionTime || new Date(),
    });

    // Call ML Service for fraud detection
    try {
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
        amount,
        merchantName,
        category,
        location,
        transactionTime: transaction.transactionTime
      });

      const { is_fraud, confidence_score } = mlResponse.data;
      
      transaction.isFraud = is_fraud;
      transaction.fraudConfidence = confidence_score;
      await transaction.save();

      if (is_fraud) {
        const FraudAlert = require('../models/FraudAlert');
        await FraudAlert.create({
          transactionId: transaction.id,
          userId: req.user.id,
          confidenceScore: confidence_score,
          reason: 'ML model detected potential fraud',
          status: 'pending'
        });
      }
    } catch (mlErr) {
      console.error('ML Service Error:', mlErr.message);
    }

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
