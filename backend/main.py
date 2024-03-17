

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

diagnosisModel = tf.keras.models.load_model("./PlantDisease/models/modelV1")

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predictImage")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = diagnosisModel.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

cropModel = DecisionTreeClassifier()
cropData = pd.read_csv(".\CropRecommend\Crop_recommendation.csv")
X = cropData.drop('label', axis=1)  # Features
y = cropData['label']  # Labels
# Train the model
cropModel.fit(X, y)
@app.post("/cropRecommend")
async def cropRecomment(data:dict):
    data_df = pd.DataFrame([data])
    # Make prediction
    predicted_class = cropModel.predict(data_df)[0]
    # Dummy confidence score, you may need to adjust based on your use case
    confidence = 1.0
    return {
        'class': predicted_class,
        'confidence': confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
