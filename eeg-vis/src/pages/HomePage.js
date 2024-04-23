import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Container, Select, MenuItem, makeStyles, Grid, Divider, CircularProgress, InputLabel, TextField, Checkbox } from '@material-ui/core';
import FeedbackButton from '../components/Feedback';
import '../styles/Comparison.css';
import '../styles/FeedbackButton.css';
import ChannelSelector from '../components/ChannelSelector';
import AnalysisResults from '../components/AnalysisResults';
import SearchSpeech from '../components/SearchSpeech';

const useStyles = makeStyles((theme) => ({
  select: {
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
}));

function HomePage() {
  const classes = useStyles();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [classifiers] = useState([
    { name: 'Random Forest' },
    { name: 'Logistic Regression' },
  ]);
  const [selectedClassifier, setSelectedClassifier] = useState(classifiers[0].name);
  const [secondSelectedClassifier, setSecondSelectedClassifier] = useState(classifiers[0].name);
  const [chosenId, setId] = useState();
  const [chosenPassword, setPassword] = useState();
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [results, setResults] = useState({
    accuracies: [],
    heatmapImages: [],
    classifier: null,
    removedChannels: [],
    speechGraphs: []
  });
  const [secondResults, setSecondResults] = useState({
    accuracies: [],
    heatmapImages: [],
    classifier: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [enableComparison, setEnableComparison] = useState(false);


  const handleFileUpload = (event) => {
    setUploadedFiles([]);
    let newUploadedFiles = [];
    for (const file of event.target.files) {
      if (file && file.name.endsWith('.mat')) {
        newUploadedFiles.push(file);
      } else {
        alert("Please upload a MATLAB file (ending in .mat)");
      }
    }
    setUploadedFiles(newUploadedFiles);
  };

  const handleClassifierChange = (event) => {
    setSelectedClassifier(event.target.value);
    setSelectedChannels([]);
    setIsLoading(false);
    setResults(prevState => ({
      ...prevState,
      accuracies: [],
      heatmapImages: [],
      classifier: null,
      removedChannels: [],
      speechGraphs: []
    }));
    setSecondResults(prevState => ({
      ...prevState,
      accuracies: [],
      heatmapImages: [],
      classifier: null,
    }));
  };

  const handleSecondClassifierChange = (event) => { 
    setSecondSelectedClassifier(event.target.value);
  };

  const handleIdChange = (event) => {
    setId(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleChannelsChange = (channels) => {
    setSelectedChannels(channels);
  };

  const handleAnalysis = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    if (selectedChannels.length === 64) {
      alert("At least one brain wave channel must be selected")
      return;
    }

    if (chosenId === null || chosenId === "") {
      alert("You must choose a Group ID so you can retrieve your results later.");
      return;
    }

    for (const uploadedFile of uploadedFiles) {
      const formData = new FormData();
      setIsLoading(true);
      
      formData.append('file', uploadedFile);
      formData.append('removedChannels', selectedChannels);
      formData.append('groupId', chosenId);
      formData.append('password', chosenPassword ? chosenPassword : '');

      if (enableComparison) {
        console.log('enablecomparison is true')
        const classifiersToCompare = [selectedClassifier, secondSelectedClassifier];
        await Promise.all(classifiersToCompare.map(async (classifier, index) => {
          formData.set('classifier', classifier);
          formData.set('index', index)
          try {
            const response = await axios.post('/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            const { accuracy, heatmap_image_base64, classifier, excluded_channels, speech_graphs } = response.data;
            if (classifier === selectedClassifier) {
              setResults(prevState => ({
                ...prevState,
                accuracies: [...prevState.accuracies, accuracy],
                heatmapImages: [...prevState.heatmapImages, heatmap_image_base64],
                classifier: classifier,
                removedChannels: [...prevState.removedChannels, excluded_channels],
                speechGraphs: [...prevState.speechGraphs, speech_graphs]
              }));
            } else if (classifier === secondSelectedClassifier) {
              setSecondResults(prevState => ({
                ...prevState,
                accuracies: [...prevState.accuracies, accuracy],
                heatmapImages: [...prevState.heatmapImages, heatmap_image_base64],
                classifier: classifier,
              }));
            }
          } catch (error) {
            console.error('Error: ', error);
          } finally {
            setIsLoading(false);
          }
        }));
      } else {
        console.log('enablecomparison is false')
        formData.append('classifier', selectedClassifier);
        formData.append('index', 0)
        try {
          const response = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const { accuracy, heatmap_image_base64, classifier, excluded_channels, speech_graphs } = response.data;
          setResults(prevState => ({
            ...prevState,
            accuracies: [...prevState.accuracies, accuracy],
            heatmapImages: [...prevState.heatmapImages, heatmap_image_base64],
            classifier: classifier,
            removedChannels: [...prevState.removedChannels, excluded_channels],
            speechGraphs: [...prevState.speechGraphs, speech_graphs]
          }));
          setSecondResults(prevState => ({
            ...prevState,
            accuracies: [],
            heatmapImages: [],
            classifier: null,
          }));
        } catch (error) {
          console.error('Error: ', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  
  

  return (
    <Container maxWidth="md" style={{ marginTop: '10px' }}>
      <Typography variant="h4" align="center">Home Page</Typography>
      <Typography variant="body1" align="center" style={{ marginBottom: '50px' }}>Welcome to our SSW 555 website!</Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" multiple>
        <Grid item>
          <input type="file" accept=".mat" onChange={handleFileUpload}/>
        </Grid>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <InputLabel htmlFor="classifier" style={{ color: 'white', marginRight: '20px' }}>Select Classifier:</InputLabel>
        <Select
          className={classes.select}
          onChange={handleClassifierChange}
          value={selectedClassifier}
          style={{ color: 'white' }}
        >
          {classifiers.map((classifier, index) => (
            <MenuItem key={index} value={classifier.name}>{classifier.name}</MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputLabel htmlFor="enable-comparison" style={{ color: 'white', marginRight: '20px' }}>Enable Comparison:</InputLabel>
          <Checkbox
            id="enable-comparison"
            checked={enableComparison}
            onChange={(e) => setEnableComparison(e.target.checked)}
            style={{ color: 'white' }}
          />
        </div>

        {enableComparison && (
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <InputLabel htmlFor="second-classifier" style={{ color: 'white', marginRight: '20px' }}>Select Second Classifier:</InputLabel>
      <Select
        className={classes.select}
        onChange={handleSecondClassifierChange}
        value={secondSelectedClassifier}
        style={{ color: 'white' }}
      >
        {classifiers.map((classifier, index) => (
          <MenuItem key={index} value={classifier.name}>{classifier.name}</MenuItem>
        ))}
      </Select>
    </div>
  )}

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <InputLabel htmlFor="id-field" style={{ color: '#C5C5F6', marginRight: '20px' }}>Enter a Group ID:</InputLabel>
        <TextField
          id="id-field"
          onChange={handleIdChange}
          label="Group ID"
          variant="filled"
          InputProps={{ style: { color: 'white', borderBottomColor: 'white' } }}
          InputLabelProps={{ style: { color: '#C5C5F6' } }}
        />

        <InputLabel htmlFor="password-field" style={{ color: '#C5C5F6', marginRight: '20px' }}>(Optional) Enter a shared password:</InputLabel>
        <TextField
          id="password-field"
          onChange={handlePasswordChange}
          label="Shared Password"
          variant="filled"
          InputProps={{ style: { color: 'white', borderBottomColor: 'white' } }}
          InputLabelProps={{ style: { color: '#C5C5F6' } }}
        />
      </div>

        <Grid item>
          <ChannelSelector onChange={handleChannelsChange} />
        </Grid>
      </Grid>
      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />

      <Grid container justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAnalysis} disabled={isLoading} style={{ marginBottom: '20px' }}>
            {isLoading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Grid>
      </Grid>

      {results.accuracies.map((accuracy, index) => (
        <div>
            <AnalysisResults
              key={index}
              comparison={selectedClassifier === "Comparison"}
              accuracy={accuracy}
              secondAccuracy={secondResults.accuracies[index]}
              classifier={results.classifier}
              secondClassifier={secondResults.classifier}
              heatmapImage={results.heatmapImages[index]}
              secondHeatmapImage={secondResults.heatmapImages[index]}
              removedChannels={results.removedChannels[index]}
            />
          <SearchSpeech graphsBase64 ={results.speechGraphs[index]}/>
        </div>

      ))}
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
    </Container>
  );
}

export default HomePage;