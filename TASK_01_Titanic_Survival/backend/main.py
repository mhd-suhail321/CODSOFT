from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so your React frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the saved model
model = joblib.load('titanic_model.pkl')

# Define the input data format using Pydantic
class PassengerData(BaseModel):
    Pclass: int
    Sex: int
    Age: float
    SibSp: int
    Parch: int
    Fare: float
    Embarked: int

@app.get("/")
def home():
    return {"message": "Titanic Survival Prediction API is Running"}

@app.post("/predict")
def predict_survival(data: PassengerData):
    # Convert incoming JSON data to a Pandas DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Make prediction
    prediction = model.predict(input_df)
    probability = model.predict_proba(input_df)[0][1]
    
    return {
        "survived": int(prediction[0]),
        "probability": round(float(probability) * 100, 2)
    }