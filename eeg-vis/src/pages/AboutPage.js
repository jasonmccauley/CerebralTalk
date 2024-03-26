import React from 'react';
import FeedbackButton from '../components/Feedback';
import '../styles/FeedbackButton.css';

function AboutPage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <br></br>
      <h1>About Page</h1>
      <div className="project-overview" style={{ textAlign: 'left' }}>
        <h2>Data Overview</h2>

        <p style={{ marginLeft: '20px' }}>Our project focuses on utilizing EEG signals to classify imagined speech through brain-computer interfaces (BCIs). We collected EEG data using state-of-the-art equipment in collaboration with Prof. Feng Liu Lab. The EEG signals were collected from a group of participants while they imagined speaking five critical words/phrases essential for basic communication: "hello," "help me," "stop," "thank you," and "yes."</p>
        <p style={{ marginLeft: '20px' }}>The data collection process involved a total of 350 trials, with 70 trials per class used for training and validation purposes. Each category had 70 trials, with 60 trials per category used for training and 10 trials per category used for validation.</p>
        <p style={{ marginLeft: '20px' }}>Our machine learning pipeline includes feature extraction, where raw EEG data is transformed into a format suitable for training ML models. We then utilize various classification algorithms, such as Random Forests, Support Vector Machines (SVMs), and Gaussian Naive Bayes, to classify the imagined speech based on the extracted features.</p>
        <p style={{ marginLeft: '20px' }}>The web application we developed allows users to upload raw EEG data, perform feature extraction, train ML models, and visualize the results. Users can interact with the data, explore different algorithms, and compare the results using interactive visualizations.</p>
        
        <h3>Main Features:</h3>
        <ul style={{ textAlign: 'left' }}>

          <li>Upload raw EEG data for analysis</li>
          <li>Utilize machine learning algorithms for classification (e.g., Random Forest, SVM, Gaussian Naive Bayes)</li>
          <li>Visualize results with interactive confusion matrices and ROC curves</li>
          <li>Customizable training and validation data specification</li>
          <li>Comparison of algorithm results</li>
          
        </ul>
      </div>
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <h2>Team Members</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Omar Elkhafif</p>
            <p><a href="mailto:oelkhafi@stevens.edu">oelkhafi@stevens.edu</a></p>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Lauren Kibalo</p>
            <p><a href="mailto:lkibalo@stevens.edu">lkibalo@stevens.edu</a></p>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Benjamin Knobloch</p>
            <p><a href="mailto:bknobloc@stevens.edu">bknobloc@stevens.edu</a></p>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Jason McCauley</p>
            <p><a href="mailto:jmccaule@stevens.edu">jmccaule@stevens.edu</a></p>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Marcos Morales</p>
            <p><a href="mailto:mmorale2@stevens.edu">mmorale2@stevens.edu</a></p>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p>Vincent Pennachio</p>
            <p><a href="mailto:vpennach@stevens.edu">vpennach@stevens.edu</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
