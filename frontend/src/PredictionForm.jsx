import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div>
      <h1>Plant Disease Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <p>Class: {prediction.class}</p>
          <p>Confidence: {prediction.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
