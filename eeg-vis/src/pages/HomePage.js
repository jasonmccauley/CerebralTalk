import React from 'react';

function HomePage() {
  const pullData = async () =>{
    const response = await fetch('/send_string', {
      method: 'POST',
    })
    const jsonData = await response.json();
    console.log(jsonData)
  }

  pullData()
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our website!</p>
    </div>
  );
}

export default HomePage;