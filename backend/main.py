from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import joblib
import os
import uvicorn
import numpy as np

app = FastAPI(title="Height Estate Price Prediction API")

# Configure CORS to allow requests from Next.js frontend.
# allow_credentials must stay False while allow_origins is "*": browsers reject a
# wildcard origin on a credentialed request, and this API sends no cookies or auth.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Public read-only API; restrict here if that changes
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model. Resolve relative to this file so the app starts the same
# way whether it is launched from backend/ or from the repository root.
MODEL_PATH = Path(__file__).resolve().parent / "Height.joblib"
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define input data schema based on your dataset
class HouseFeatures(BaseModel):
    crim: float      # Crime rate
    zn: float        # Proportion of residential land
    indus: float     # Proportion of non-retail business acres
    chas: int        # Charles River (0 or 1)
    nox: float       # Nitric oxides concentration
    rm: float        # Average number of rooms
    age: float       # Proportion of owner-occupied units built prior to 1940
    dis: float       # Weighted distances to employment centres
    rad: int         # Index of accessibility to radial highways
    tax: int         # Property tax rate
    ptratio: float   # Pupil-teacher ratio
    b: float         # Proportion of Black residents
    lstat: float     # Percentage of lower status population
    # medv: float      # Median value of homes (target in training, but needed for reference)

class PredictionResponse(BaseModel):
    predicted_price: float       # In dollars
    predicted_price_medv: float  # Raw model output, in $1000s (same scale as medv)
    formatted_price: str

@app.get("/")
def read_root():
    return {
        "message": "Height Estate Price Prediction API",
        "status": "running",
        "model_loaded": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(features: HouseFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert input to array format - order matches your dataset columns
        input_data = np.array([[
            features.crim,
            features.zn,
            features.indus,
            features.chas,
            features.nox,
            features.rm,
            features.age,
            features.dis,
            features.rad,
            features.tax,
            features.ptratio,
            features.b,
            features.lstat,
            # features.medv
        ]])
        
        # Make prediction. The model was trained on medv, which the dataset
        # records in $1000s, so scale up to dollars before reporting a price.
        prediction_medv = float(model.predict(input_data)[0])
        prediction_usd = prediction_medv * 1000

        # Format price with commas
        formatted_price = f"${prediction_usd:,.2f}"

        return {
            "predicted_price": prediction_usd,
            "predicted_price_medv": prediction_medv,
            "formatted_price": formatted_price
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
def get_model_info():
    """Get information about the loaded model"""
    if model is None:
        return {"error": "Model not loaded"}
    
    return {
        "model_type": type(model).__name__,
        "model_loaded": True,
        "features": ["crim", "zn", "indus", "chas", "nox", "rm", "age", "dis", "rad", "tax", "ptratio", "b", "lstat"]
    }

if __name__ == "__main__":
    # Hosts like Render assign the port at runtime via $PORT.
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))