const Transaction = require('../models/Transaction');
const axios = require('axios');
require('dotenv').config();

const { Op } = require('sequelize');

exports.getTransactions = async (req, res) => {
  try {
    const { search, category, startDate, endDate } = req.query;
    const where = { userId: req.user.id };

    if (search) {
      where.merchantName = { [Op.like]: `%${search}%` };
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (startDate || endDate) {
      where.transactionTime = {};
      if (startDate) where.transactionTime[Op.gte] = new Date(startDate);
      if (endDate) where.transactionTime[Op.lte] = new Date(endDate);
    }

    const transactions = await Transaction.findAll({ 
      where,
      order: [['transactionTime', 'DESC']]
    });
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

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.scanReceipt = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ message: 'No image provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is missing on the server." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash as it supports multimodal (images + text)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert OCR receipt parsing AI.
      Please analyze this receipt image and extract the following details.
      Return ONLY a valid JSON object with the following keys, and no other text:
      - amount (number, the total amount of the receipt, just the number)
      - merchantName (string, the name of the store or merchant)
      - category (string, best guess category e.g., 'Food', 'Groceries', 'Entertainment', 'Transport', 'Shopping', 'Utilities')
      - date (string, YYYY-MM-DD format if found, otherwise omit)
      
      Example output:
      {"amount": 12.50, "merchantName": "Starbucks", "category": "Food", "date": "2023-10-24"}
    `;

    // Strip the data:image/...;base64, prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg" // Adjust if needed, but flash handles jpeg/png fine
        }
      }
    ]);

    const responseText = result.response.text();
    // Sometimes the model wraps JSON in ```json ... ```
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedText);

    // Save as a new transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      amount: -Math.abs(parsedData.amount), // Ensure it's an expense
      merchantName: parsedData.merchantName || 'Unknown Merchant',
      category: parsedData.category || 'Shopping',
      location: 'Scanned Receipt',
      transactionTime: parsedData.date ? new Date(parsedData.date) : new Date(),
      isFraud: false,
      fraudConfidence: 0
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Scan Receipt Error:', err);
    res.status(500).json({ message: 'Failed to process receipt', error: err.message });
  }
};
