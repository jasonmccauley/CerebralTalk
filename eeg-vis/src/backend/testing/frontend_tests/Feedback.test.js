import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FeedbackButton from '../../../components/Feedback';

describe('FeedbackButton', () => {
  test('clicking the button opens feedback link in a new tab', () => {
    const { getByText } = render(<FeedbackButton />);
    const button = getByText('Feedback');

    const mockOpen = jest.spyOn(window, 'open').mockImplementation(() => {});

    fireEvent.click(button);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSepArILR2PKTxI00Sxvoobyehw_EnrO9wAm667VTMbrzXySwQ/viewform?usp=sf_link',
      '_blank'
    );

    mockOpen.mockRestore(); 
  });
});