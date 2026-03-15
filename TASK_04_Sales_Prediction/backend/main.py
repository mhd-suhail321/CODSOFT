from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# 1. Initialize the App
app = FastAPI()

# 2. Configure CORS (Allows React to talk to Python)
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# 3. Load the pre-trained model
model = joblib.load("sales_model.pkl")

# 4. Define the Input Data Schema
class SalesInput(BaseModel):
    tv: float
    radio: float
    newspaper: float

# 5. Prediction Route (Fixed to avoid UserWarnings)
@app.post("/predict")
def predict_sales(data: SalesInput):
    # We use a DataFrame with column names to match the training data
    input_df = pd.DataFrame(
        [[data.tv, data.radio, data.newspaper]], 
        columns=['TV', 'Radio', 'Newspaper']
    )
    
    prediction = model.predict(input_df)[0]
    return {"predicted_sales": round(float(prediction), 2)}