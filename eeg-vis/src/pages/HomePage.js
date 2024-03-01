import React from 'react';

function HomePage() {
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
    console.log(jsonData)
  }

  //calls pullData()
  pullData()
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website!</p>
    </div>
  );
}

export default HomePage;