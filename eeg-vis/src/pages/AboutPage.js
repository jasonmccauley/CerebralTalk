import React from 'react';
import FeedbackButton from '../components/Feedback';
import '../styles/FeedbackButton.css';

function AboutPage() {
    return (
      <div>
        <h1>About Page</h1>
        <p>Welcome to our team: Jason, Omar, Lauren, Marcos, Ben, and Vincent!</p>
        <p>We are the coolest team!</p>
        <div className="feedback-button-container">
        <FeedbackButton />
        </div>
      </div>
    );
  }
  
  export default AboutPage;