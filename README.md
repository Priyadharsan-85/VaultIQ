<div align="center">

```
██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗██╗ ██████╗ 
██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██║██╔═══██╗
██║   ██║███████║██║   ██║██║     ██║   ██║██║   ██║
╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██║██║▄▄ ██║
 ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ██║╚██████╔╝
  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝ ╚══▀▀═╝ 
```

### 🏦 Your AI-Powered Personal Finance Guardian

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Apache Kafka](https://img.shields.io/badge/Flask-ML_Service-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

---

> *"Built to mirror what JPMorgan Chase does every day — detecting fraud, tracking money, and keeping finances safe at scale."*

</div>

---

##  What is VaultIQ?

**VaultIQ** is not just another finance app. It's a **production-grade, AI-powered financial intelligence platform** that combines three powerful capabilities into one unified dashboard:

| Budget Tracking | Fraud Detection | Live Markets |
|---|---|---|
| Track every rupee across categories in real-time | ML model flags suspicious transactions instantly | Live crypto & stock prices updating every 30s |

Think of VaultIQ as your **personal bank manager, fraud investigator, and market analyst** — all working 24/7, all in one place.

---

## Features

### Secure Authentication
- JWT-based login & registration
- Bcrypt password hashing
- Protected routes with auto-redirect

### Smart Dashboard
- Real-time balance overview
- Spending breakdown by category (Pie Chart)
- 7-day spending trend (Line Chart)
- Recent transactions at a glance
- 4 live summary cards — Income, Expenses, Alerts, Budget

### Transaction Management
- Add, view, and filter transactions
- Auto fraud check on every new transaction
- Color-coded status — 🟢 Normal / 🔴 Fraud
- Search by merchant name
- Risk tagging — Low / Medium / High

### AI Fraud Detection *(The Star Feature)*
- Isolation Forest ML model trained on 500+ transactions
- Detects anomalies based on:
  - Unusually high amounts
  - Late-night transaction timing
  - Unknown/new locations
  - Abnormal transaction frequency
  - Unusual merchant categories
- Returns **confidence score (0–100%)** for every flagged transaction
- Instant alerts with fraud reason

###  Live Market Tracker
- **Crypto:** Bitcoin, Ethereum, Solana, Cardano, Dogecoin
- **Stocks:** Apple, Google, Microsoft, Amazon, Tesla
- Powered by **CoinGecko API** & **Alpha Vantage API**
- Price flash animation on update
- Auto-refresh every 30 seconds

### Smart Budget Manager
- Set monthly limits per category
- Progress bars with color warnings:
  - 🟢 Under 60% — Safe
  - 🟡 60–80% — Caution
  - 🔴 Above 80% — Danger
- Toast alerts before you overspend

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│              React Frontend — Port 3000                 │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / Axios
┌────────────────────────▼────────────────────────────────┐
│              Node.js Backend — Port 5000                │
│         Express · JWT Auth · REST API                   │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐  ┌───────────▼───────────────────┐
│  PostgreSQL DB       │  │  Flask ML Service — Port 8000 │
│  Port 5432           │  │  scikit-learn · Isolation     │
│  Users, Transactions │  │  Forest · Fraud Prediction    │
│  Alerts, Budgets     │  └───────────────────────────────┘
└─────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│              External APIs                              │
│   CoinGecko (Crypto) · Alpha Vantage (Stocks)           │
└─────────────────────────────────────────────────────────┘
```

---

##  Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js + Tailwind CSS | UI & User Experience |
| **Charts** | Recharts | Data Visualization |
| **Backend** | Node.js + Express.js | API & Business Logic |
| **Auth** | JWT + Bcryptjs | Secure Authentication |
| **Database** | PostgreSQL + Sequelize | Data Persistence |
| **ML Service** | Python + Flask + scikit-learn | Fraud Detection |
| **Crypto API** | CoinGecko | Live Crypto Prices |
| **Stock API** | Alpha Vantage | Live Stock Prices |
| **Container** | Docker + Docker Compose | Deployment |

---

## Project Structure

```
VaultIQ/
│
├── 📂 client/                      # React Frontend
│   └── src/
│       ├── 📂 components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── TransactionCard.jsx
│       │   ├── FraudAlertCard.jsx
│       │   ├── BudgetMeter.jsx
│       │   └── MarketTicker.jsx
│       ├── 📂 pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   ├── FraudAlerts.jsx
│       │   └── Market.jsx
│       └── 📂 context/
│           └── AuthContext.jsx
│
├── 📂 server/                      # Node.js Backend
│   ├── 📂 routes/
│   ├── 📂 models/
│   ├── 📂 controllers/
│   ├── 📂 middleware/
│   └── index.js
│
├── 📂 ml-service/                  # Python ML Service
│   ├── 📂 model/
│   │   └── fraud_model.pkl
│   ├── 📂 data/
│   │   └── transactions.csv
│   ├── train.py
│   └── app.py
│
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

Make sure you have these installed:

```bash
node --version      # v18+
npm --version       # v9+
python --version    # v3.8+
docker --version    # optional but recommended
```

### Quick Start (3 Terminals)

**Terminal 1 — Frontend:**
```bash
cd client
npm install
npm start
# → http://localhost:3000
```

**Terminal 2 — Backend:**
```bash
cd server
npm install
npm start
# → http://localhost:5000
```

**Terminal 3 — ML Service:**
```bash
cd ml-service
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
python train.py             # Train the fraud model first
python app.py
# → http://localhost:8000
```

### Docker Quick Start
```bash
docker-compose up --build
```
All 3 services start automatically! 

---

## nvironment Variables

Create a `.env` file inside the `server/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vaultiq
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# External APIs
COINGECKO_API_URL=https://api.coingecko.com/api/v3
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions/add` | Add + auto fraud check |
| GET | `/api/transactions/:id` | Get single transaction |

### Fraud
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fraud/alerts` | Get all fraud alerts |
| POST | `/api/fraud/detect` | Manual fraud check |
| PUT | `/api/fraud/alerts/:id/review` | Mark alert as reviewed |

### Market
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/crypto` | Live crypto prices |
| GET | `/api/market/stocks` | Live stock prices |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budget` | Get all budgets |
| POST | `/api/budget/set` | Set category budget |
| PUT | `/api/budget/update/:category` | Update budget limit |

---

## ML Fraud Detection — How It Works

```
New Transaction Comes In
         ↓
Extract Features:
  • amount
  • hour_of_day
  • transaction_frequency
  • location_change (0 or 1)
  • merchant_category_encoded
         ↓
Feed into Isolation Forest Model
         ↓
Model checks: "Is this an anomaly?"
         ↓
┌─────────────┬──────────────────────┐
│  NORMAL     │      FRAUD           │
│ confidence  │  confidence score    │
│   < 50%     │      > 50%           │
└─────────────┴──────────────────────┘
         ↓
Save result to database
         ↓
Send alert to user if fraud
```

**Why Isolation Forest?**
> It learns what "normal" looks like and isolates anything that doesn't fit — perfect for fraud where anomalies are rare but critical.

---

##  Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2),
  merchant_name VARCHAR(100),
  category VARCHAR(50),
  location VARCHAR(100),
  transaction_time TIMESTAMP,
  is_fraud BOOLEAN DEFAULT FALSE,
  fraud_confidence DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fraud Alerts
CREATE TABLE fraud_alerts (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  user_id INTEGER REFERENCES users(id),
  confidence_score DECIMAL(5,2),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  category VARCHAR(50),
  monthly_limit DECIMAL(10,2),
  current_spent DECIMAL(10,2) DEFAULT 0,
  month INTEGER,
  year INTEGER
);
```

---

## Why VaultIQ Stands Out

| Feature | VaultIQ | Regular Finance Apps |
|---------|---------|---------------------|
| AI Fraud Detection | ✅ Real ML Model | ❌ Rule-based only |
| Confidence Scoring | ✅ 0-100% score | ❌ Just yes/no |
| Live Market Data | ✅ Crypto + Stocks | ❌ Not included |
| Smart Budget Alerts | ✅ Before overspend | ❌ After overspend |
| Risk Tagging | ✅ Low/Med/High | ❌ Not included |
| Microservices Arch | ✅ 3 independent services | ❌ Monolithic |

---

## Real-World Inspiration

VaultIQ is inspired by how the world's top financial institutions protect their customers:

> **JPMorgan Chase** — Processes trillions daily with real-time fraud detection  
> **PayPal** — Flags suspicious payments using ML anomaly detection  
> **CRED** — Tracks spending patterns and sends smart alerts  
> **Razorpay** — Secures transactions with multi-layer verification  

---

##  Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo
git fork https://github.com/yourusername/VaultIQ

# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "feat: add your feature"

# Push & create PR
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for learning and building your portfolio.

---
