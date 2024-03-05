import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useState } from 'react';
/*
Notes on file paths in React:
- Any file path is relative to the "public" folder
- Even though the "build" folder from "npm run build" doesn't have a "public" folder, 
  anything that was previously in the "public" folder is 
*/
function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedClassifier, setSelectedClassifier] = useState('Random Forest'); 
  const [accuracy, setAccuracy] = useState(null)
  const [heatmapImage, setHeatmapImage] = useState(null)
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
    setSelectedClassifier(event.target.value); // Updates selectedClassifier state according to value selected in dropdown
  };

  const handleAnalysis = async () => {
    if (!uploadedFile){
      alert("Please upload a file");
      return;
    }

    const formData = new FormData(); // Creates an instance called formData, and appends the uploadedFile to send to backend
    formData.append('file', uploadedFile);
    setIsLoading(true);
    try{
      const response = await axios.post('/upload', formData, { // Sends post request to backend with formData, which stores uploadedFile
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      const {accuracy, heatmap_image_base64} = response.data; // Returns accuracy and heatmap in base64 from the response data, since these were returned in the backend
      setAccuracy(accuracy); // Update state varaibles for accuracy and heatmapImage
      setHeatmapImage(heatmap_image_base64);
    } 
    catch(error){
      console.error('Error: ', error);
    }
    finally {
      setIsLoading(false);
    }
  };


  
  const [imageSrc, setImageSrc] = useState("./logo192.png")
  const [inputSrc, setInputSrc] = useState(imageSrc)

  // async function used to call function from python, being async allows the function to contain "await"
  const pullData = async () =>{
    /*fetch() takes the app route that was defined for send_string() to call send_string()
    response = the json returned by send_string()

    Since data is being fetched from another server, "await" is used to ensure the rest of the function doesn't execute until
    the data has been fetched and stored in variable response

    "await" basically tells the program to pause any more code execution within the function until the line of code with "await" 
    is consindered to be complete (look up JS promises for more on this)
    
    In this case we're telling pullData() "after you try fetching data don't do anything else until you have that json from flask"

    Without "await" the rest of the function executes regardless of if the fetch request has been completed which means the
    variable response may not contain the fetched json by the time it tries to parse it and/or print it
    */
    const response = await fetch('/send_string', {
      method: 'POST',
    })
    //parses the json
    const jsonData = await response.json();

    //prints the json to the console
    console.log(jsonData['message'])
  }


  const updateImage = () => {
    setImageSrc(inputSrc)
  }

  //calls pullData()
  pullData()
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website!</p>

      <div>
        <input type="file" accept=".mat" onChange={handleFileUpload}/>
      </div>

      <div>
        <label htmlFor="classifier">Select Classifier:</label>
        <select id="classifier" value={selectedClassifier} onChange={handleClassifierChange}>
          <option value="RandomForest">Random Forest</option>
        </select>
      </div>

      <div>
        <button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
      </div>

      {accuracy !== null && (
        <div>
          <p>Accuracy: {accuracy}</p>
        </div>
      )}

      {heatmapImage && (
        <div>
          <img src={`data:image/jpeg;base64,${heatmapImage}`} alt='Heatmap' />
        </div>
      )}
      
      <div>
        <input 
            placeholder="file path" 
            onChange={(e) => setInputSrc(e.target.value)}
          />
        <button onClick={updateImage}>Display image</button>
      </div>
      <img src={imageSrc} alt="sampleImage"/>
    </div>
  );
}

export default HomePage;