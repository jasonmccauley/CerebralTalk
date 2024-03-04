import React from 'react';

import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
  test('renders homepage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const homepageElement = screen.getByText(/Home Page/i);
    expect(homepageElement).toBeInTheDocument();
  });

  test('renders about page when navigating to /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    const aboutPageElement = screen.getByText(/About Page/i);
    expect(aboutPageElement).toBeInTheDocument();
  });
});