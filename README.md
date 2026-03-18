# VaultIQ - Smart Personal Finance Dashboard

VaultIQ is a smart personal finance dashboard that tracks spending, detects fraudulent transactions using ML, and shows live market prices.

## Features
- **JWT Auth**: Secure registration and login.
- **Fraud Detection**: Real-time ML-based fraud scoring using scikit-learn.
- **Market Data**: Live crypto (CoinGecko) and stock (Alpha Vantage) prices.
- **Budget Tracker**: Monthly category limits with visual progress.
- **Responsive Dashboard**: Beautiful dark-themed UI with spending charts.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Recharts, Axios, Lucide-React
- **Backend**: Node.js, Express.js, Sequelize (PostgreSQL)
- **ML Service**: Python, Flask, scikit-learn (Isolation Forest)
- **Containerization**: Docker, Docker Compose

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed.
- Alpha Vantage API Key (Optional for stocks).

### Running with Docker (Recommended)
1. Clone the repository.
2. In the root directory, run:
   ```bash
   docker compose up --build
   ```
3. Access the application at `http://localhost:3000`.

### Local Setup (Manual Workaround)
This project is configured to use **SQLite** by default for easy setup without a separate database server.

1. **ML Service**:
   - `cd ml-service`
   - `pip install -r requirements.txt`
   - `python app.py` (Runs on http://127.0.0.1:8000)
2. **Backend**:
   - `cd server`
   - `npm install`
   - Create a `.env` file from the sample.
   - `npm run dev` (Runs on Port 5000)
3. **Frontend**:
   - `cd client`
   - `npm install`
   - `npm start` (Runs on Port 3000)

## Security & GitHub
Before pushing to GitHub, ensure your `.gitignore` is active. This project excludes:
- `.env` files (Secret API keys)
- `node_modules/`
- `database.sqlite` (Local data)
- Python virtual environments and caches.

## Environment Variables (.env)
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`
- `ML_SERVICE_URL`
- `ALPHA_VANTAGE_API_KEY`
- `REACT_APP_API_URL`

## Future Improvements
- Multi-currency support.
- Bank statement CSV import.
- Advanced predictive budgeting.
