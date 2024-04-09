import React, { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import AnalysisResults from '../components/AnalysisResults';
import { Button, CircularProgress, Typography, Container, makeStyles, Select, MenuItem, FormControl, InputLabel, TextField, Grid } from '@material-ui/core';




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
    '& .MuiSelect-icon': {
      fill: 'white',
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

  const [enteredPassword, setPassword] = useState();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const filteredData = data.filter((entry) => {
    const password = entry.password || "";

    if (filter === 'All') return enteredPassword === password; // Show all data if filter is 'All'
    // Adjust entry.classifier to have a default value of "Random Forest"
    const classifier = entry.classifier || "Random Forest";
    return classifier === filter && enteredPassword === password; // Filter data based on classifier
  });

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h3" gutterBottom>
        EEG Data Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the EEG data page. Use the dropdown to filter the data by classifier and then press the button below to see the EEG data.
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center" textAlign="center">
      <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl fullWidth>
          <InputLabel id="filter-select-label" style={{ color: 'white' }}>Filter By:</InputLabel>
          <Select
            className={classes.select}
            labelId="filter-select-label"
            id="filter-select"
            value={filter}
            onChange={handleFilterChange}
            style={{ color: 'white' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Random Forest">Random Forest</MenuItem>
            <MenuItem value="Logistic Regression">Logistic Regression</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <InputLabel id="password-specification-label" style={{ color: 'white', marginBottom: '8px' }}>Enter your UID:</InputLabel>
        <FormControl fullWidth style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            id="password-filter"
            onChange={handlePasswordChange}
            label="Filled"
            variant="filled"
            size="small"
            style={{ width: '50%' }}
            InputProps={{ style: { color: 'white', borderBottomColor: 'white' } }}
            InputLabelProps={{ style: { color: '#C5C5F6' } }}
          />
        </FormControl>
      </Grid>
      </Grid>
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
      {!isLoading && filteredData && enteredPassword && (
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