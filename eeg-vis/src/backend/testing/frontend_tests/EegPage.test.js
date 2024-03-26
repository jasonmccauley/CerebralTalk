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
        { _id: '123', accuracy: 0.99, heatmap_image_base64: 'base64string' },
        { _id: '456', accuracy: 0.88, heatmap_image_base64: 'anotherBase64string' }
      ]
    }
  });

  render(<EegPage />);

  // Trigger the data fetch
  fireEvent.click(screen.getByText('Show EEG Data'));

  // Wait for the "Accuracy: 0.99" text to appear in the document
  expect(await screen.findByText(/Accuracy: 0.99/)).toBeInTheDocument();
  
  // Similarly, wait for the "Accuracy: 0.88" text to be found
  expect(await screen.findByText(/Accuracy: 0.88/)).toBeInTheDocument();
});
