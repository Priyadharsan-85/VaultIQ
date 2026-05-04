const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const FraudAlert = require("../models/FraudAlert");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.processChat = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const userId = req.user.id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is missing on the server." });
    }

    const marketController = require("./marketController");
    
    // 1. Fetch User Context (Transactions, Budgets, Alerts)
    const [transactions, budgets, alerts] = await Promise.all([
      Transaction.findAll({ where: { userId }, limit: 15, order: [['transactionTime', 'DESC']] }),
      Budget.findAll({ where: { userId } }),
      FraudAlert.findAll({ where: { userId }, limit: 5, order: [['createdAt', 'DESC']], include: [Transaction] })
    ]);

    // 2. Mock some global context if live fetch fails (Market Snapshot)
    const marketContext = "BTC: $64,230 (+1.2%), ETH: $3,450 (-0.5%), AAPL: $182.40, TSLA: $171.05";

    // 2. Prepare Context for AI
    const contextStr = `
      User Context:
      - Recent Transactions: ${transactions.map(t => `${t.merchantName}: ₹${t.amount} (${t.category})`).join(", ")}
      - Budget Limits: ${budgets.map(b => `${b.category}: ₹${b.monthlyLimit}`).join(", ")}
      - Recent Fraud Alerts: ${alerts.map(a => `Alert for ${a.Transaction?.merchantName} (Confidence: ${a.confidenceScore})`).join(", ")}
      
      Global Market Snapshot:
      ${marketContext}
    `;

    const systemPrompt = `
      You are Omni-Vault AI, the intelligent financial assistant for NexaGuard. 
      Your tone is professional, sophisticated, and slightly futuristic.
      Always use the user's financial context provided below to give accurate insights.
      If the user asks about their spending, check the transactions.
      If the user is over budget, warn them politely but firmly.
      If there are fraud alerts, emphasize security.
      Keep responses concise and formatted with markdown.
      
      Financial Context:
      ${contextStr}
    `;

    // 3. Generate AI Response
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Omni-Vault AI. How can I assist with your financial security today?" }] },
        ...chatHistory.map(ch => ({ 
          role: ch.role === 'model' ? 'model' : 'user', 
          parts: [{ text: typeof ch.parts === 'string' ? ch.parts : ch.parts[0].text }] 
        }))
      ],
    });

    console.log("Sending message to Gemini:", message);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (err) {
    console.error("AI Error Detailed:", err);
    res.status(500).json({ 
      error: "AI_ERROR", 
      message: err.message,
      details: err.response?.data || "No additional details"
    });
  }
};

exports.getInsight = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({ 
      where: { userId }, 
      limit: 10, 
      order: [['transactionTime', 'DESC']] 
    });

    const context = transactions.map(t => `${t.merchantName}: ₹${t.amount} (${t.category})`).join(", ");
    
    const prompt = `
      Based on these recent transactions: ${context || "None yet"}
      Provide a single, short, witty financial insight (max 15 words) for a dashboard.
      Start with a quote or a direct observation.
      Example: "Entertainment spending is down 10%. You're a financial ninja."
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^"|"$/g, '');
    
    res.json({ insight: text });
  } catch (err) {
    console.error("Insight Error:", err);
    res.json({ insight: "You're in control of your financial destiny." }); // Fallback
  }
};
