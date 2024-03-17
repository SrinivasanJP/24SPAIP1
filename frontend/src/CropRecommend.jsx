import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CropRecommend = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState(null);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null);
        },
        (error) => {
          setError('Error occurred while retrieving location.');
          console.error('Error occurred while retrieving location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      console.error('Geolocation is not supported by this browser.');
    }
  };
  useEffect(()=>{
    getLocation()
  })

  const [prediction, setPrediction] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/cropRecommend', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div>
      <h1>Plant Disease Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>N:</label>
        <input type="text" name="N" value={formData.N} onChange={handleChange} /><br />
        <label>P:</label>
        <input type="text" name="P" value={formData.P} onChange={handleChange} /><br />
        <label>K:</label>
        <input type="text" name="K" value={formData.K} onChange={handleChange} /><br />
        <label>Temperature:</label>
        <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} /><br />
        <label>Humidity:</label>
        <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} /><br />
        <label>pH:</label>
        <input type="text" name="ph" value={formData.ph} onChange={handleChange} /><br />
        <label>Rainfall:</label>
        <input type="text" name="rainfall" value={formData.rainfall} onChange={handleChange} /><br />
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <div>
          <h2>Prediction Result:</h2>
          <p>Class: {prediction.class}</p>
          <p>Confidence: {prediction.confidence}</p>
        </div>
      )}
      {latitude && (
        <div>
          <h2>GEO Result:</h2>
          <p>lat: {latitude}</p>
          <p>log: {longitude}</p>
        </div>
      )}
    </div>
  );
};

export default CropRecommend;
