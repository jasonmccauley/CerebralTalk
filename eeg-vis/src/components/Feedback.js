import React from 'react';

function FeedbackButton() {
  const handleFeedback = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSepArILR2PKTxI00Sxvoobyehw_EnrO9wAm667VTMbrzXySwQ/viewform?usp=sf_link', '_blank'); 
  };

  return (
    <button className="feedback-button" onClick={handleFeedback}>Feedback</button>
  );
}

export default FeedbackButton;