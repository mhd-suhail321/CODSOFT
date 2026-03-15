from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Load the new 3-feature model
model = joblib.load("fraud_model.pkl")

class Transaction(BaseModel):
    location_delta: float
    device_score: float
    amount: float

@app.post("/verify")
def verify_transaction(data: Transaction):
    # We only send the 3 features the model was trained on
    input_df = pd.DataFrame(
        [[data.location_delta, data.device_score, data.amount]], 
        columns=['V14', 'V10', 'Amount']
    )
    
    # Get probability
    prob = model.predict_proba(input_df)[0][1] 
    
    status = "FRAUD" if prob > 0.5 else "GENUINE"
    threat = "CRITICAL" if prob > 0.8 else "ELEVATED" if prob > 0.3 else "LOW"

    return {
        "status": status,
        "risk_score": round(float(prob * 100), 2),
        "threat_level": threat
    }