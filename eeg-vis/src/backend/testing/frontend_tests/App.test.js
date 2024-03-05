import { render, screen } from '@testing-library/react';
import App from '../../../App';

test('renders Home Page text', () => {
  render(<App />);
  const linkElement = screen.getByText("Home Page");
  expect(linkElement).toBeInTheDocument();
});
