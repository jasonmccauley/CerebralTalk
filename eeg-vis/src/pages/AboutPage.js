import React from 'react';
import FeedbackButton from '../components/Feedback';
import {
  Container,
  Typography,
  makeStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import '../styles/FeedbackButton.css';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  projectOverview: {
    textAlign: 'left',
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  teamMembers: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    textAlign: 'center',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  card: {
    width: '100%',
    backgroundColor: 'rgb(197, 197, 246)',
    borderRadius: '10px',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  cardText: {
    fontWeight: 'bold',
    color: '#333'
  },
}));

function AboutPage() {
  const classes = useStyles();

  // text for cards
  const cardContainerText = [
    'Upload raw EEG data for analysis',
    'Utilize machine learning algorithms for classification (e.g., Random Forest, SVM, Gaussian Naive Bayes)',
    'Visualize results with interactive confusion matrices and ROC curves',
    'Customizable training and validation data specification',
    'Comparison of algorithm results'
  ]

  // info for each team member
  const teamInfo = [
    {'name' : 'Omar Elkhafif', 'email' : 'oelkhafi@stevens.edu'},
    {'name' : 'Lauren Kibalo', 'email' : 'lkibalo@stevens.edu'},
    {'name' : 'Benjamin Knobloch', 'email' : 'bknobloc@stevens.edu'},
    {'name' : 'Jason McCauley','email' : 'jmccaule@stevens.edu'},
    {'name' : 'Marcos Morales','email' : 'mmorale2@stevens.edu'},
    {'name' : 'Vincent Pennachio', 'email' : 'vpennach@stevens.edu'}
  ]
  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        About Page
      </Typography>
      <br></br>
      <div className={classes.projectOverview}>
        <Typography variant="h5">Data Overview</Typography>
        <Typography paragraph>
          Our project focuses on utilizing EEG signals to classify imagined speech through brain-computer interfaces (BCIs).
          We collected EEG data using state-of-the-art equipment in collaboration with Prof. Feng Liu Lab. The EEG signals were
          collected from a group of participants while they imagined speaking five critical words/phrases essential for basic communication:
          "hello," "help me," "stop," "thank you," and "yes."
          <br/><br/>
          The data collection process involved a total of 350 trials, with 70 trials per class used for training and validation purposes.
          Each category had 70 trials, with 60 trials per category used for training and 10 trials per category used for validation.
          <br/><br/>
          Our machine learning pipeline includes feature extraction, where raw EEG data is transformed into a format suitable for training ML models.
          We then utilize various classification algorithms, such as Random Forests, Support Vector Machines (SVMs), and Gaussian Naive Bayes,
          to classify the imagined speech based on the extracted features.
          <br/><br/>
          The web application we developed allows users to upload raw EEG data, perform feature extraction, train ML models, and visualize the results.
          Users can interact with the data, explore different algorithms, and compare the results using interactive visualizations.
        </Typography>
        <Typography variant="h6">Main Features</Typography>

        <div className={classes.cardContainer}>
          {cardContainerText.map((text, index) => (
            <Card key={index} className={classes.card}>
            <CardContent>
              <Typography variant="subtitle1" className={classes.cardText}>
                {text}
              </Typography>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
      <div className="feedback-button-container">
        <FeedbackButton />
      </div>
      <div className={classes.teamMembers}>
        <Typography variant="h5" gutterBottom>
          Team Members
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {teamInfo.map((member, index) => (
            <div key={index} style={{ margin: '10px', width: '30%' }}>
              <Typography>{member['name']}</Typography>
              <Typography><a href={`mailto:${member['email']}`}>{member['email']}</a></Typography>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default AboutPage;