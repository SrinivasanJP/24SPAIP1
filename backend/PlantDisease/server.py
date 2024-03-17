from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the saved model
model = tf.keras.models.load_model("./models/modelV3.keras")

# Define class names
CLASS_NAMES = ["class_1", "class_2", "class_3"]  # Update with your class names

# Define a function to preprocess the image
def preprocess_image(image):
    image = tf.image.resize(image, (256, 256))  # Resize the image
    image /= 255.0  # Rescale pixel values to [0, 1]
    return image

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get the image file from the request
    file = request.files['image']
    # Read the image file
    image = tf.keras.preprocessing.image.img_to_array(file)
    # Preprocess the image
    image = preprocess_image(image)
    # Expand dimensions to match the model input shape
    image = np.expand_dims(image, axis=0)
    # Make prediction
    predictions = model.predict(image)
    # Get the predicted class index
    predicted_class_index = np.argmax(predictions[0])
    # Get the predicted class name
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    # Get the confidence
    confidence = round(100 * np.max(predictions[0]), 2)
    # Return the prediction as JSON response
    return jsonify({'class': predicted_class_name, 'confidence': confidence})

if __name__ == '__main__':
    app.run(debug=True)
