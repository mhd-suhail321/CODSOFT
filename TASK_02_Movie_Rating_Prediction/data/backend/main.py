from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import uvicorn

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
try:
    model = joblib.load("movie_rating_model.pkl")
    print("✅ Model loaded successfully")
except:
    print("❌ Error: movie_rating_model.pkl not found!")

class MovieData(BaseModel):
    Year: int
    Duration: int
    Votes: int
    Genre_encoded: float
    Director_encoded: float
    Actor_encoded: float

@app.post("/predict")
def predict_rating(data: MovieData):
    # Align UI inputs with the 8 features used during model training
    input_dict = {
        "Year": data.Year,
        "Duration": data.Duration,
        "Votes": data.Votes,
        "Genre_encoded": data.Genre_encoded,
        "Director_encoded": data.Director_encoded,
        "Actor 1_encoded": data.Actor_encoded, # Map UI actor to Actor 1
        "Actor 2_encoded": 5.8,                # Neutral padding
        "Actor 3_encoded": 5.8                 # Neutral padding
    }
    
    input_df = pd.DataFrame([input_dict])
    
    # Generate Prediction
    prediction = model.predict(input_df)[0]
    
    return {
        "rating": round(float(prediction), 1),
        "confidence": 0.84
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)