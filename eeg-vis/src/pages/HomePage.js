import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Container, Select, MenuItem, makeStyles } from '@material-ui/core';
import FeedbackButton from '../components/Feedback';
import '../styles/Comparison.css';
import '../styles/FeedbackButton.css';
import ChannelSelector from '../components/ChannelSelector';
import AnalysisResults from '../components/AnalysisResults';

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
  },
}));

function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [classifiers] = useState([
    { name: 'Random Forest' },
    { name: 'Logistic Regression' },
    { name: 'Comparison'},
  ]);
  const [selectedClassifier, setSelectedClassifier] = useState(classifiers[0].name);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [results, setResults] = useState({
    accuracies: [],
    heatmapImages: [],
    classifier: null,
    removedChannels: [],
  });
  const [secondResults, setSecondResults] = useState({
    accuracies: [],
    heatmapImages: [],
    classifier: null,
  });

  const [isLoading, setIsLoading] = useState(false);


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
    console.log("files uploaded");
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
    }));
    setSecondResults(prevState => ({
      ...prevState,
      accuracies: [],
      heatmapImages: [],
      classifier: null,
    }));
  };

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

    for (const uploadedFile of uploadedFiles) {
      console.log("analyzing one");
      const formData = new FormData();
      setIsLoading(true);
      
      formData.append('file', uploadedFile);
      formData.append('removedChannels', selectedChannels);

      if (selectedClassifier === 'Comparison') {
        const classifiersToCompare = ['Random Forest', 'Logistic Regression'];
        await Promise.all(classifiersToCompare.map(async classifier => {
          formData.set('classifier', classifier);
          try {
            const response = await axios.post('/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            const { accuracy, heatmap_image_base64, classifier, excluded_channels } = response.data;
            if (classifier === 'Random Forest') {
              setResults(prevState => ({
                ...prevState,
                accuracies: [...prevState.accuracies, accuracy],
                heatmapImages: [...prevState.heatmapImages, heatmap_image_base64],
                classifier: classifier,
                removedChannels: excluded_channels,
              }));
            } else if (classifier === 'Logistic Regression') {
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
        formData.append('classifier', selectedClassifier);
        try {
          const response = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const { accuracy, heatmap_image_base64, classifier, excluded_channels } = response.data;
          setResults(prevState => ({
            ...prevState,
            accuracies: [...prevState.accuracies, accuracy],
            heatmapImages: [...prevState.heatmapImages, heatmap_image_base64],
            classifier: classifier,
            removedChannels: excluded_channels,
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
    console.log(results.accuracies);
    console.log(secondResults.accuracies);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '10px' }}>
      <Typography variant="h4" align="center">Home Page</Typography>
      <Typography variant="body1" align="center" style={{ marginBottom: '50px' }}>Welcome to our SSW 555 website!</Typography>

      <div>
        <input type="file" accept=".mat" onChange={handleFileUpload} multiple/>
      </div>

      <div>
        <label htmlFor="classifier">Select Classifier:</label>
        <Select className={useStyles().select} onChange={handleClassifierChange} value={selectedClassifier}>
          {classifiers.map((classifier, index) => (
            <MenuItem key={index} value={classifier.name}>{classifier.name}</MenuItem>
          ))}
        </Select>
      </div>

      <div>
        <ChannelSelector onChange={handleChannelsChange} />
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Analyze'}
        </Button>
      </div>

      {results.accuracies.map((accuracy, index) => (
        <AnalysisResults
          key={index}
          comparison={selectedClassifier === "Comparison"}
          accuracy={accuracy}
          secondAccuracy={secondResults.accuracies[index]}
          classifier={results.classifier}
          secondClassifier={secondResults.classifier}
          heatmapImage={results.heatmapImages[index]}
          secondHeatmapImage={secondResults.heatmapImages[index]}
          removedChannels={results.removedChannels}
        />
      ))}
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
    </Container>
  );
}

export default HomePage;