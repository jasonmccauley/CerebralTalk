import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchSpeech from '../../../components/SearchSpeech';

test('checks for imagined speech dropdown', () => {
    render(<SearchSpeech />);
    const dropDown = screen.getByText("Select Imagined Speech:")
    expect(dropDown).toBeInTheDocument();
});

test('checks that dropdown options are clickable', () => {
    const sampleData = {'1': 0, '2': 1, '3': 2}

    const { getByLabelText, getByText } = render(<SearchSpeech graphsBase64={sampleData} />)

    const dropdown = getByLabelText('Select Imagined Speech:'); // Find the dropdown by its accessible label
    
    // check that each option is in the dropdown menu
    Object.keys(sampleData).forEach(key =>{
        fireEvent.mouseDown(dropdown);
        const option = getByText(key);
        fireEvent.click(option);
        expect(option).toBeInTheDocument();
    })
});

test('clicking an option displays the corresponding graph', () => {
    const sampleData = {'1': 0, '2': 1, '3': 2}

    const { getByLabelText, getByText, getByAltText } = render(<SearchSpeech graphsBase64={sampleData} />)
    const dropdown = getByLabelText('Select Imagined Speech:')
    
    // check that each option is in the dropdown menu
    Object.keys(sampleData).forEach(key =>{
        fireEvent.mouseDown(dropdown);
        const option = getByText(key);
        fireEvent.click(option);
        const graph = getByAltText(`Graph for ${key}`)
        expect(graph).toBeInTheDocument();
    })
});
  