import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os
import random
from datetime import datetime, timedelta

def generate_mock_data(n=500):
    data = []
    categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills']
    
    for i in range(n):
        # 90% normal, 10% fraudulent
        is_fraud = random.random() < 0.1
        
        if not is_fraud:
            amount = random.uniform(100, 5000)
            hour = random.randint(8, 22) # Normal hours
            freq = random.randint(1, 5) # Transactions per day
            loc_change = 0 # Known location
        else:
            amount = random.uniform(20000, 100000)
            hour = random.randint(0, 5) # Late night
            freq = random.randint(10, 50) # High frequency
            loc_change = 1 # Unknown location
            
        data.append([amount, hour, freq, loc_change, is_fraud])
    
    df = pd.DataFrame(data, columns=['amount', 'hour', 'freq', 'loc_change', 'is_fraud'])
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/transactions.csv', index=False)
    return df

def train_model():
    df = generate_mock_data()
    X = df[['amount', 'hour', 'freq', 'loc_change']]
    
    # Train Isolation Forest
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X)
    
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/fraud_model.pkl')
    print("Model trained and saved.")

if __name__ == "__main__":
    train_model()
