import React, { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import AnalysisResults from '../components/AnalysisResults';
import { Button, CircularProgress, Typography, Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(50),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(2),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
}));

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
  const classes = useStyles();
  // Use the custom hook to fetch data
  const { data, isLoading, error, fetchData } = useFetchData('/data');

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h3" gutterBottom>
        EEG Data Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the EEG data page. Press the button below to see the EEG data.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchData}
        disabled={isLoading}
        className={classes.button}
      >
        {isLoading ? 'Loading...' : 'Show EEG Data'}
      </Button>
      {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
      {isLoading && <CircularProgress className={classes.loading} />}
      {!isLoading && data && (
        <div>
          {Object.keys(data).map((key) => {
            let removedChannels = data[key].excluded_channels || [];
            // Display the base64 image and other data
            return (
              <div key={key}>
                <Typography variant="body1" paragraph>Data Entry number: {Number(key) + 1}</Typography>
                <AnalysisResults accuracy={data[key].accuracy} classifier={data[key].classifier} heatmapImage={data[key].heatmap_image_base64} removedChannels={removedChannels} />
              </div>
            )
          })}
        </div>
      )}
      <div>
        <FeedbackButton />
      </div>
    </Container>
  );
}

export default EegPage;
