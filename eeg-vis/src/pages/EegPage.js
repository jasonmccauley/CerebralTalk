import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import AnalysisResults from '../components/AnalysisResults';
import { Button, CircularProgress, Typography, FormControlLabel, Checkbox, Container, makeStyles, Select, MenuItem, FormControl, InputLabel, TextField, Grid } from '@material-ui/core';

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
  },
  formControlLabel: {
    marginLeft: 0, 
    marginRight: 0, 
    justifyContent: 'start',
  },
  checkboxMargin: {
    marginTop: theme.spacing(2) // Define a style for the checkbox margin
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

  const [enteredId, setId] = useState();
  const [enteredPassword, setPassword] = useState();
  const [showRemovedOnly, setShowRemovedOnly] = useState(false);
  const [accuracyFilter, setAccuracyFilter] = useState(0);

  const showRemovedOnlyRef = useRef(showRemovedOnly);
  useEffect(() => {
    showRemovedOnlyRef.current = showRemovedOnly;
  }, [showRemovedOnly]); // Update the ref whenever showRemovedOnly changes

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleIdChange = (event) => {
    setId(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAccuracyFilterChange = (event) => {
    setAccuracyFilter(event.target.value);
  };
  

  const filteredData = data.filter((entry) => {
    const groupId = entry.groupId || "";
    const password = entry.password || "";
    const classifier = entry.classifier || "Random Forest";
    const removedChannels = entry.excluded_channels || [];
  
    // Updated check to exclude entries with "none" or an empty string in excluded_channels
    const hasRemovedChannels = removedChannels.length > 0 && !removedChannels.includes("none") && !removedChannels.includes("");
  
    // Apply the 'showRemovedOnly' filter
    const showEntry = showRemovedOnly ? hasRemovedChannels : true;
  
    // Additional filters
    const matchesClassifier = filter === 'All' || classifier === filter;
    const matchesGroupID = enteredId === "all" || groupId === enteredId;
    const matchesPassword = !enteredPassword || password === enteredPassword;
    const exceedsAccuracyFilter = entry.accuracy > accuracyFilter;
  
    return matchesClassifier && matchesGroupID && matchesPassword && exceedsAccuracyFilter && showEntry;
  });
  
  
  
  

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h3" gutterBottom>
        EEG Data Page
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the EEG data page. Use the dropdown to filter the data by classifier, enter your chosen password, and then press the button below to see the EEG data.
      </Typography>
      <Grid container spacing={2} alignItems="flex-start" justifyContent="center">
  <Grid item xs={12} sm={12} md={6}>
    <FormControl fullWidth>
      <InputLabel id="filter-select-label" htmlFor='filter-select' style={{ color: 'white' }}>Filter By:</InputLabel>
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
        <MenuItem value="Support Vector Classifier">Support Vector Classifier</MenuItem>
      </Select>
    </FormControl>

    <FormControl fullWidth>
    <InputLabel id="accuracy-select-label" htmlFor='accuracy-select' style={{ color: 'white' }}>Accuracy Greater than:</InputLabel>
    <Select
      className={classes.select}
      labelId="accuracy-select-label"
      id="accuracy-select"
      value={accuracyFilter}
      onChange={handleAccuracyFilterChange}
      style={{ color: 'white' }}
    >
      <MenuItem value={0}>0.0</MenuItem>
      <MenuItem value={0.1}>0.1</MenuItem>
      <MenuItem value={0.2}>0.2</MenuItem>
      <MenuItem value={0.3}>0.3</MenuItem>
      <MenuItem value={0.4}>0.4</MenuItem>
      <MenuItem value={0.5}>0.5</MenuItem>
      <MenuItem value={0.6}>0.6</MenuItem>
      <MenuItem value={0.7}>0.7</MenuItem>
    </Select>
  </FormControl>

    <FormControlLabel
  control={
    <Checkbox
      checked={showRemovedOnly}
      onChange={(e) => setShowRemovedOnly(e.target.checked)}
    />
  }
  label="Results with Removed Channels"
  className={classes.formControlLabel}
  style={{ color: 'white', marginTop: 16 }}
/>
  </Grid>
      <Grid item xs={12} sm={6}>
        <InputLabel id="groupId-specification-label" htmlFor='groupId-filter' style={{ color: 'white', marginBottom: '8px' }}>Enter your Group ID (or "all"):</InputLabel>
        <FormControl fullWidth style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            id="groupId-filter"
            onChange={handleIdChange}
            label="Group ID"
            variant="filled"
            size="small"
            style={{ width: '50%' }}
            InputProps={{ style: { color: 'white', borderBottomColor: 'white' } }}
            InputLabelProps={{ style: { color: '#C5C5F6' } }}
          />
        </FormControl>

        <InputLabel id="password-specification-label" htmlFor='password-filter' style={{ color: 'white', marginBottom: '8px' }}>(Optional) Enter your password:</InputLabel>
        <FormControl fullWidth style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            id="password-filter"
            onChange={handlePasswordChange}
            label="Password"
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
      {!isLoading && filteredData && enteredId && (
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