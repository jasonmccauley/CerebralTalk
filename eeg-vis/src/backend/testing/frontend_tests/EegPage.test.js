import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EegPage from '../../../pages/EegPage';
import axios from 'axios';

// Properly mock axios module, finally got it working by forcing the axios library to be accessed in the package.json
jest.mock('axios');

// Now set the mock implementation
axios.get.mockResolvedValue({
  data: {
    data: [
      { _id: '123', accuracy: 0.99, heatmap_image_base64: 'base64string' },
      { _id: '456', accuracy: 0.88, heatmap_image_base64: 'base64string' }
    ]
  }
});

test('renders EEG Data Page text', async () => {
  render(<EegPage />);
  expect(await screen.findByText('EEG Data Page')).toBeInTheDocument();
});

test('displays loading text while fetching data', async () => {
  // Setup axios to resolve immediately with mock data to not delay the test
  axios.get.mockResolvedValueOnce({ data: { data: [] } });

  render(<EegPage />);

  // Simulate clicking the "Show EEG Data" button to initiate data fetching
  fireEvent.click(screen.getByText('Show EEG Data'));

  // Check for "Loading..." text
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Optionally, wait for the button text to change back to "Show EEG Data" indicating loading is complete
  await screen.findByText('Show EEG Data');
});

test('displays data entries after successful fetch', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      data: [
        { _id: '123', password: 'test_password', accuracy: 0.99, heatmap_image_base64: 'base64string'},
        { _id: '456', password: 'test_password', accuracy: 0.88, heatmap_image_base64: 'anotherBase64string'}
      ]
    }
  });

  render(<EegPage />);

  // Simulate entering "test_password" as the user keyword
  const passwordField = screen.getByLabelText('Enter your UID:');
  fireEvent.change(passwordField, { target: { defaultValue: 'test_password' } });

  // Access the value of the password field
  const passwordValue = passwordField.defaultValue;
  expect(passwordValue === 'test_password');

  // Trigger the data fetch
  fireEvent.click(screen.getByText('Show EEG Data'));

  // Wait for the "Data Entry number: 1" text to appear in the document
  expect(await screen.findByText(/Accuracy: 0.99/)).toBeInTheDocument();
});

// Test that classifier names and removed channels are correctly displayed after refactoring of data fetch
test('displays classifiers and removed channels correctly after successful refactoring of data fetch', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      data: [
        { _id: '123', password: 'test_password', accuracy: 0.99, heatmap_image_base64: 'base64string', classifier: 'Random Forest', excluded_channels:['FC1','Fp1'] },
        { _id: '456', password: 'test_password', accuracy: 0.88, heatmap_image_base64: 'anotherBase64string', classifier: 'Logistic Regression', excluded_channels:['P4','TP9'] }
      ]
    }
  });
  render(<EegPage />);

  // Simulate entering "test_password" as the user keyword
  const passwordField = screen.getByLabelText('Enter your UID:');
  fireEvent.change(passwordField, { target: { value: 'test_password' } });

  // Access the value of the password field
  const passwordValue = passwordField.value;
  expect(passwordValue === 'test_password');

  // Trigger the data fetch
  fireEvent.click(screen.getByText('Show EEG Data'));

  // Assertions for classifiers
  expect(await screen.findByText(/Classifier: Random Forest/)).toBeInTheDocument();
  expect(await screen.findByText(/Classifier: Logistic Regression/)).toBeInTheDocument();

  // Assertions for removed channels
  // Note: Adjust these assertions based on how your component actually renders this data
  expect(await screen.findByText(/Removed channels: FC1, Fp1/)).toBeInTheDocument();
  expect(await screen.findByText(/Removed channels: P4, TP9/)).toBeInTheDocument();
});