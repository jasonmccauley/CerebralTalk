import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Container, Select, MenuItem, FormControl, InputLabel, CircularProgress, Grid, Divider, makeStyles } from '@material-ui/core';
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
  const [uploadedFiles, setUploadedFile] = useState();
  const [classifiers] = useState([
    { name: 'Random Forest' },
    { name: 'Logistic Regression' },
    { name: 'Comparison'},
     // Add new classifiers here
  ]);
  const [selectedClassifier, setSelectedClassifier] = useState(classifiers[0].name);
  const [accuracies, setAccuracy] = useState([]);
  const [heatmapImages, setHeatmapImage] = useState([]);
  const [classifier, setClassifier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [removedChannels, setRemovedChannels] = useState([]);

  const [secondAccuracies, setSecondAccuracy] = useState([]);
  const [secondHeatmapImages, setSecondHeatmapImage] = useState([]);
  const [secondClassifier, setSecondClassifier] = useState(null);
// Additional state for comparison results, if needed

  const handleFileUpload = (event) => {
    setUploadedFile([]);
    let newUploadedFiles = [];
    for (const file of event.target.files) {
      if (file && file.name.endsWith('.mat')){ // Checking if uploaded file is MATLAB file
        newUploadedFiles.push(file); // Updates uploadedFile state with inputted file
      }
      else{
        alert("Please upload a MATLAB file (ending in .mat)");
      }
    }
    setUploadedFile(newUploadedFiles);
  };

  const handleClassifierChange = (event) => {
    setSelectedClassifier(event.target.value); // Correctly updates selectedClassifier state
    
    // Reset all result-related states whenever the classifier changes
    setAccuracy(null);
    setHeatmapImage(null);
    setClassifier(null);
    setSecondAccuracy(null);
    setSecondHeatmapImage(null);
    setSecondClassifier(null);
    setRemovedChannels([]);
  };

  const handleChannelsChange = (channels) => {
    setSelectedChannels(channels);
  };

  const handleAnalysis = async () => {

    if (!uploadedFiles || uploadedFiles == []){
      alert("Please upload at least one file");
      return;
    }

    if (selectedChannels.length === 64){
      alert("At least one brain wave channel must be selected")
      return;
    }

    const newHeatmapImages = [];
    const newSecondHeatmapImages = [];
    const newAccuracies = [];
    const newSecondAccuracies = [];
    for (const uploadedFile of uploadedFiles) {

      const formData = new FormData(); // Creates an instance called formData, and appends the uploadedFile to send to backend
      setIsLoading(true);
      formData.append('file', uploadedFile);
      formData.append('removedChannels', selectedChannels);

      if (selectedClassifier === 'Comparison'){
        const classifiersToCompare = ['Random Forest', 'Logistic Regression'];

        await Promise.all(classifiersToCompare.map(async classifier => {
          formData.set('classifier', classifier);

          try {
            const response = await axios.post('/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (classifier === 'Random Forest') {
              const { accuracy, heatmap_image_base64, classifier, excluded_channels } = response.data;
              newAccuracies.push(accuracy);
              newHeatmapImages.push(heatmap_image_base64);
              setClassifier(classifier);
              setRemovedChannels(excluded_channels);
            } else if (classifier === 'Logistic Regression') {
              const { accuracy, heatmap_image_base64, classifier } = response.data;
              newSecondAccuracies.push(accuracy);
              newSecondHeatmapImages.push(heatmap_image_base64);
              setSecondClassifier(classifier);
              // Assuming you're not updating removed channels or handling it differently for comparison
            }
          } catch (error) {
            console.error('Error: ', error);
          } finally {
            setIsLoading(false);
          }
        }));
      }
     else {
      formData.append('classifier', selectedClassifier); // Append selected classifier
      try {
        const response = await axios.post('/upload', formData, { // Sends post request to backend with formData, which stores uploadedFile
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      

        const {accuracy, heatmap_image_base64, classifier, excluded_channels} = response.data; // Returns accuracy and heatmap in base64 from the response data, since these were returned in the backend
        newAccuracies.push(accuracy);
        newSecondAccuracies.push(null); // Update state varaibles for accuracy and heatmapImage
        newHeatmapImages.push(heatmap_image_base64);
        newSecondHeatmapImages.push(null);
        setClassifier(classifier)
        setRemovedChannels(excluded_channels)

      }
      catch(error){
        console.error('Error: ', error);
      }
      finally {
        setIsLoading(false);
      } 
    }
    }
    setHeatmapImage(newHeatmapImages);
    setSecondHeatmapImage(newSecondHeatmapImages);
    setAccuracy(newAccuracies);
    setSecondAccuracy(newAccuracies);
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

      {/* Displaying results */}
      {accuracies !== null && heatmapImages !== null &&
      heatmapImages.map((heatmap, index) => (
        <AnalysisResults
          key={index}
          comparison={selectedClassifier === "Comparison"}
          accuracy={accuracies[index]}
          secondAccuracy={secondAccuracies[index]}
          classifier={classifier}
          secondClassifier={secondClassifier}
          heatmapImage={heatmap}
          secondHeatmapImage={secondHeatmapImages[index]}
          removedChannels={removedChannels}
        />
      ))}
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
    </Container>
  );
}

export default HomePage;