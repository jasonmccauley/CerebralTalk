import React from 'react';
import { useState } from 'react';
/*
Notes on file paths in React:
- Any file path is relative to the "public" folder
- Even though the "build" folder from "npm run build" doesn't have a "public" folder, 
  anything that was previously in the "public" folder is 
*/
function HomePage() {
  
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