from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import uvicorn
import numpy as np

app = FastAPI(title="Height Estate Price Prediction API")

# Configure CORS to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",  # Next.js default port
                  "https://*.vercel.app",  # For Vercel deployment
        "*"],  # Allow all origins (you can restrict this later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
try:
    model = joblib.load('Height.joblib')
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
    predicted_price: float
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
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        
        # Format price with commas
        formatted_price = f"${prediction:,.2f}"
        
        return {
            "predicted_price": float(prediction),
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
    uvicorn.run(app, host="0.0.0.0", port=8000)