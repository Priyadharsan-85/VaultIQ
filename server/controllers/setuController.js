const User = require('../models/User');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// Mock Setu Account Aggregator Integration
// In a real production environment, you would use Axios to call:
// POST https://fiu-sandbox.setu.co/v2/consents

exports.checkStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.aaConsentId) {
      return res.json({ isLinked: true, phone: user.phone });
    }
    return res.json({ isLinked: false });
  } catch (err) {
    console.error('Error checking Setu status:', err);
    res.status(500).json({ error: 'Failed to check status' });
  }
};

exports.createConsent = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required for Indian Account Aggregator' });
    }

    const user = await User.findByPk(userId);
    user.phone = phone;
    
    // Generate a mock Setu Consent ID
    const mockConsentId = 'setu_consent_' + crypto.randomBytes(8).toString('hex');
    user.aaConsentId = mockConsentId;
    await user.save();

    // In a real integration, you redirect the user to Setu's Consent URL
    // e.g., https://fiu-sandbox.setu.co/v2/consents/{mockConsentId}/webview
    
    res.json({ 
      success: true, 
      consentId: mockConsentId,
      message: 'Setu Consent Request Created'
    });

  } catch (error) {
    console.error('Setu Consent Error:', error);
    res.status(500).json({ error: 'Failed to create AA consent' });
  }
};

exports.syncData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user.aaConsentId) {
      return res.status(400).json({ error: 'User has not granted Account Aggregator consent' });
    }

    // Mocking an encrypted data pull from an Indian Bank (HDFC/SBI/ICICI)
    // In production, this involves requesting an FI Data Session and decrypting JWS payloads.
    
    const mockIndianTransactions = [
      { amount: -250, merchantName: 'Swiggy', category: 'Food and Drink' },
      { amount: -1500, merchantName: 'JioMart', category: 'Groceries' },
      { amount: -890, merchantName: 'Uber India', category: 'Travel' },
      { amount: -199, merchantName: 'Netflix', category: 'Entertainment' },
      { amount: -50, merchantName: 'UPI/Zomato', category: 'Food and Drink' }
    ];

    const newTransactions = [];
    for (let txn of mockIndianTransactions) {
      const mappedTxn = await Transaction.create({
        userId,
        amount: txn.amount,
        merchantName: txn.merchantName,
        category: txn.category,
        location: 'India',
        transactionTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random date within last 30 days
      });
      newTransactions.push(mappedTxn);
    }

    res.json({ 
      message: 'Indian Bank data synced successfully via Setu AA', 
      count: newTransactions.length, 
      transactions: newTransactions 
    });

  } catch (error) {
    console.error('Setu Sync Error:', error);
    res.status(500).json({ error: 'Failed to sync Account Aggregator data' });
  }
};
