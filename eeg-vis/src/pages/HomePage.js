import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import FeedbackButton from '../components/Feedback';
import '../styles/FeedbackButton.css';

function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [classifiers] = useState([
    { name: 'Random Forest' },
    { name: 'New Classifier' }, // Add new classifiers here
  ]);
  const [selectedClassifier, setSelectedClassifier] = useState(classifiers[1].name);
  const [accuracy, setAccuracy] = useState(null)
  const [heatmapImage, setHeatmapImage] = useState(null)
  const [classifier, setClassifier] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

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
  };
  

  const handleAnalysis = async () => {
    if (!uploadedFile){
      alert("Please upload a file");
      return;
    }

    const formData = new FormData(); // Creates an instance called formData, and appends the uploadedFile to send to backend
    formData.append('file', uploadedFile);
    formData.append('classifier', selectedClassifier); // Append selected classifier
    setIsLoading(true);
    try{
      const response = await axios.post('/upload', formData, { // Sends post request to backend with formData, which stores uploadedFile
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      const {accuracy, heatmap_image_base64, classifier} = response.data; // Returns accuracy and heatmap in base64 from the response data, since these were returned in the backend
      setAccuracy(accuracy); // Update state varaibles for accuracy and heatmapImage
      setHeatmapImage(heatmap_image_base64);
      setClassifier(classifier)
    } 
    catch(error){
      console.error('Error: ', error);
    }
    finally {
      setIsLoading(false);
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
        <button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
      </div>

      
      {accuracy !== null && (
        //Only returns classifier when accuracy is no longer null to avoid prematurely displaying classifier
        <div>
          <p>Classifier: {classifier}</p>
          <p>Accuracy: {accuracy}</p>
        </div>
      )}

      {heatmapImage && (
        <div>
          <img src={`data:image/jpeg;base64,${heatmapImage}`} alt='Heatmap' />
        </div>
      )}
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
    </div>
  );
}

export default HomePage;