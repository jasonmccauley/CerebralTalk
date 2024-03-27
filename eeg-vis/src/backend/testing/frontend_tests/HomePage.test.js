import { render, screen } from '@testing-library/react';
import HomePage from '../../../pages/HomePage';

test('checks for classifier dropdown', () => {
  render(<HomePage />);
  const dropDown = screen.getByText("Select Classifier:")
  expect(dropDown).toBeInTheDocument();
});
