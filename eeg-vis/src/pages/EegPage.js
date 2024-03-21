import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import '../styles/FeedbackButton.css';

function EegPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch data from the server
  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/data');
      setData(response.data.data); // Adjust depending on the actual response structure
      setIsLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setIsLoading(false);
    }
  };

    return (
      <div>
        <h1>EEG Data Page</h1>
        <p>Welcome to the EEG data page, press on the button below to see the EEG data</p>
        <button onClick={fetchData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Show EEG Data'}
        </button>
        {error && <p>Error: {error}</p>}
    <div>
      {data && (
        <div>
          {Object.keys(data).map((key) => {
              // Display the base64 image
              return <div>
                <p>Data Entry number: {Number(key)+1}</p>
                <p>Classifier: {data[key].classifier} </p>
                <p>Accuracy: {data[key].accuracy}</p>
                <img src={`data:image/png;base64,${data[key].heatmap_image_base64}`} alt="Heatmap" />
                </div>;
            // Display other data
            //return <pre>{JSON.stringify(data, null, 2)}</pre>;
          })}
        </div>
      )}
    </div>
    <div className="feedback-button-container">
        <FeedbackButton />
      </div>
      </div>
    );
  }
  
  export default EegPage;