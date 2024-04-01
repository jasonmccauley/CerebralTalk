import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import FeedbackButton from '../components/Feedback';
import '../styles/Comparison.css';
import '../styles/FeedbackButton.css';
import ChannelSelector from '../components/ChannelSelector';
import AnalysisResults from '../components/AnalysisResults';

function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [classifiers] = useState([
    { name: 'Random Forest' },
    { name: 'Logistic Regression' },
    { name: 'Comparison'},
     // Add new classifiers here
  ]);
  const [selectedClassifier, setSelectedClassifier] = useState(classifiers[0].name);
  const [accuracy, setAccuracy] = useState(null)
  const [heatmapImage, setHeatmapImage] = useState(null)
  const [classifier, setClassifier] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [removedChannels, setRemovedChannels] = useState([])

  const [secondAccuracy, setSecondAccuracy] = useState(null);
  const [secondHeatmapImage, setSecondHeatmapImage] = useState(null);
  const [secondClassifier, setSecondClassifier] = useState(null);
// Additional state for comparison results, if needed
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Takes first file selected by the user
    if (file && file.name.endsWith('.mat')){ // Checking if uploaded file is MATLAB file
      setUploadedFile(file); // Updates uploadedFile state with inputted file
    }
    else{
      alert("Please upload a MATLAB file (ending in .mat)")
    }
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

    if (!uploadedFile){
      alert("Please upload a file");
      return;
    }

    if (selectedChannels.length === 64){
      alert("At least one brain wave channel must be selected")
      return
    }

    const formData = new FormData(); // Creates an instance called formData, and appends the uploadedFile to send to backend
    setIsLoading(true);
    formData.append('file', uploadedFile);
    formData.append('removedChannels', selectedChannels);

    if (selectedClassifier === 'Comparison'){
      const classifiersToCompare = ['Random Forest', 'Logistic Regression']; // Example classifiers
      for (const classifier of classifiersToCompare) {
        formData.set('classifier', classifier); // Update classifier in formData for each call
        try {
          const response = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          // Assuming you will handle the response to update state differently based on the classifier
          // This is a simplified example, you'll need to adjust logic to properly handle and display both sets of results
          if (classifier === 'Random Forest') {
            const { accuracy, heatmap_image_base64, classifier, excluded_channels } = response.data;
            setAccuracy(accuracy);
            setHeatmapImage(heatmap_image_base64);
            setClassifier(classifier);
            setRemovedChannels(excluded_channels);
          } else if (classifier === 'Logistic Regression') {
            const { accuracy, heatmap_image_base64, classifier} = response.data;
            setSecondAccuracy(accuracy);
            setSecondHeatmapImage(heatmap_image_base64);
            setSecondClassifier(classifier);
            // Assuming you're not updating removed channels or handling it differently for comparison
          }
        } catch (error) {
          console.error('Error: ', error);
        }
        finally {
          setIsLoading(false);
        } 
      }
    }
    else {
    formData.append('classifier', selectedClassifier); // Append selected classifier
    try{
      const response = await axios.post('/upload', formData, { // Sends post request to backend with formData, which stores uploadedFile
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    

      const {accuracy, heatmap_image_base64, classifier, excluded_channels} = response.data; // Returns accuracy and heatmap in base64 from the response data, since these were returned in the backend
      setAccuracy(accuracy); // Update state varaibles for accuracy and heatmapImage
      setHeatmapImage(heatmap_image_base64);
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
  };


  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website!</p>

      <div>
        <input type="file" accept=".mat" onChange={handleFileUpload}/>
      </div>

      <div>
        <label htmlFor="classifier">Select Classifier:</label>

        <select onChange={handleClassifierChange} value={selectedClassifier}>
  {classifiers.map((classifier, index) => (
    <option key={index} value={classifier.name}>{classifier.name}</option>
  ))}
</select>
      </div>

      <div>
        <ChannelSelector onChange={handleChannelsChange} />
        <button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
      </div>

      
      
  {/* Displaying results for a single classifier */}
  {accuracy !== null &&
    (<AnalysisResults comparison={selectedClassifier==="Comparison"} accuracy={accuracy} secondAccuracy={secondAccuracy} classifier={classifier} secondClassifier={secondClassifier} heatmapImage={heatmapImage} secondHeatmapImage={secondHeatmapImage} removedChannels={removedChannels}/>)
  }

    <div className="feedback-button-container">
      <FeedbackButton />
    </div>

    </div>
  )
}

export default HomePage;