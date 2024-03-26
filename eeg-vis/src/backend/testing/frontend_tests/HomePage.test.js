import { render, screen } from '@testing-library/react';
import HomePage from '../../../pages/HomePage';

test('renders sampleImage', () => {
  render(<HomePage />);
  const imageElement = screen.getByText("Select Classifier:")
  expect(imageElement).toBeInTheDocument();
});
