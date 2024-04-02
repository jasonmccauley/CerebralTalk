import React, { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import '../styles/FeedbackButton.css';
import AnalysisResults from '../components/AnalysisResults';

function useFetchData(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(url);
      setData(response.data.data); // Adjust based on actual response structure
    } catch (error) {
      setError(error.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
}
function EegPage() {
   // Use the custom hook to fetch data
  const { data, isLoading, error, fetchData } = useFetchData('/data');
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
              let removedChannels = data[key].excluded_channels || [];
              // Display the base64 image and other data
              return (
                <div key={key}>
                  <p>Data Entry number: {Number(key)+1}</p>
                  <AnalysisResults accuracy={data[key].accuracy} classifier={data[key].classifier} heatmapImage={data[key].heatmap_image_base64} removedChannels={removedChannels}/>
                </div>
              )
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