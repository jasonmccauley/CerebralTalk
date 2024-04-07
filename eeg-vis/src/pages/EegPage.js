import React, { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import AnalysisResults from '../components/AnalysisResults';
import { Button, CircularProgress, Typography, Container, makeStyles, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

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
  select:{
    color: 'white',
    backgroundColor: 'transparent',
    width: '200px',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
  }
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
  const [filter, setFilter] = useState('All'); // Added state for filter

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const filteredData = data.filter((entry) => {
    if (filter === 'All') return true; // Show all data if filter is 'All'
    // Adjust entry.classifier to have a default value of "Random Forest"
    const classifier = entry.classifier || "Random Forest";
    return classifier === filter; // Filter data based on classifier
  });

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h3" gutterBottom>
        EEG Data Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the EEG data page. Use the dropdown to filter the data by classifier and then press the button below to see the EEG data.
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="filter-select-label">Filter By:</InputLabel>
        <Select
          className={useStyles().select}
          labelId="filter-select-label"
          id="filter-select"
          value={filter}
          onChange={handleFilterChange}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Random Forest">Random Forest</MenuItem>
          <MenuItem value="Logistic Regression">Logistic Regression</MenuItem>
        </Select>
      </FormControl>
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
      {!isLoading && filteredData && (
        <div>
          {Object.keys(filteredData).map((key) => {
            let removedChannels = filteredData[key].excluded_channels || [];
             // Setting classifier to "Random Forest" if it is undefined or any falsy value
             let classifier = filteredData[key].classifier || "Random Forest";
            // Display the base64 image and other data
            return (
              <div key={key}>
                <Typography variant="body1" paragraph>Data Entry number: {Number(key) + 1}</Typography>
                <AnalysisResults accuracy={filteredData[key].accuracy} classifier={classifier} heatmapImage={filteredData[key].heatmap_image_base64} removedChannels={removedChannels} />
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