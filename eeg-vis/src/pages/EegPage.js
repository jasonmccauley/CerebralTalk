import React from 'react';
import { useState } from 'react';

function EegPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch data from the server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data');
      if (!response.ok) throw new Error('Data fetching failed');
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
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
        {data.map((item, index) => (
          <div key={index}>
            {Object.keys(item).map(key => (
              <p key={key}>{`${key}: ${item[key]}`}</p>
            ))}
          </div>
        ))}
      </div>
      </div>
    );
  }
  
  export default EegPage;