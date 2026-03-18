from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load model
MODEL_PATH = 'model/fraud_model.pkl'
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        print("Model file not found. Please run train.py first.")

load_model()

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json
    # Preprocessing (Mock logic for simplicity)
    amount = float(data.get('amount', 0))
    # Extract features from transaction (simplified)
    # In a real app, you'd calculate frequency and location change from DB history
    hour = 12 # Default
    freq = 1
    loc_change = 0
    
    # Check for obvious flags for better demo effect
    if amount > 20000:
        hour = 2 # Late night
        loc_change = 1
        
    X_new = pd.DataFrame([[amount, hour, freq, loc_change]], 
                         columns=['amount', 'hour', 'freq', 'loc_change'])
    
    prediction = model.predict(X_new)
    # IsolationForest returns -1 for anomalies (fraud) and 1 for normal
    is_fraud = True if prediction[0] == -1 else False
    
    # Calculate a mock confidence score
    scores = model.decision_function(X_new)
    # Decision function returns negative for anomalies
    confidence_score = abs(scores[0]) * 100
    if confidence_score > 100: confidence_score = 95
    
    return jsonify({
        "is_fraud": is_fraud,
        "confidence_score": round(float(confidence_score), 2)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)
