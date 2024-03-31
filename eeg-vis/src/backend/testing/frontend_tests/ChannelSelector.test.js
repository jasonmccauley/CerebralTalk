import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChannelSelector from '../../../components/ChannelSelector';

const channelList = ['Fp1', 'Fp2', 'F7', 'F3', 'Fz', 'F4', 'F8', 'FC5', 
'FC1', 'FC2', 'FC6', 'T7', 'C3', 'Cz', 'C4', 'T8', 'TP9', 'CP5', 
'CP1', 'CP2', 'CP6', 'TP10', 'P7', 'P3', 'Pz', 'P4', 'P8', 'PO9', 
'O1', 'Oz', 'O2', 'PO10', 'AF7', 'AF3', 'AF4', 'AF8', 'F5', 'F1', 
'F2', 'F6', 'FT9', 'FT7', 'FC3', 'FC4', 'FT8', 'FT10', 'C5', 'C1', 
'C2', 'C6', 'TP7', 'CP3', 'CPz', 'CP4', 'TP8', 'P5', 'P1', 'P2', 
'P6', 'PO7', 'PO3', 'POz', 'PO4', 'PO8'
]

test('deselect all unchecks every checkbox', () => {
    let selectedChannels = []

    const handleChannelsChange = (channels) => {
        selectedChannels = channels
    };
    const { getByText, getByRole } = render(<ChannelSelector onChange={handleChannelsChange}/>);
    const deselectAllButton = getByText('Deselect all');
  
    fireEvent.click(deselectAllButton);
    expect(selectedChannels.length).toEqual(64)
});
test('select all checks every checkbox', () => {
    let selectedChannels = []

    const handleChannelsChange = (channels) => {
        selectedChannels = channels
    };
    const { getByText, getByRole } = render(<ChannelSelector onChange={handleChannelsChange}/>);
    const deselectAllButton = getByText('Deselect all');
    const selectAllButton = getByText('Select all');
  
    fireEvent.click(deselectAllButton);
    fireEvent.click(selectAllButton);
  
    expect(selectedChannels.length).toEqual(0)
});

test('verify every channel is displayed', () => {
    const handleChannelsChange = (channels) => {
    };

    render(<ChannelSelector onChange={handleChannelsChange}/>)

    channelList.forEach((channel) => {
        const c = screen.getByText(channel)
        expect(c).toBeInTheDocument();
    })
});

test('test that each checkbox can be toggled by manually clicking each one', () => {
    let selectedChannels = []

    const handleChannelsChange = (channels) => {
        selectedChannels = channels
    };
    const { getByLabelText } = render(<ChannelSelector onChange={handleChannelsChange}/>);
    
    // unchecks and checks each checkbox and verifies that both clicks worked
    channelList.forEach((channelToClick) => {
        // Find the checkbox element with the corresponding channel value
        const checkbox = getByLabelText(channelToClick);    
        fireEvent.click(checkbox);  
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);  
        expect(checkbox.checked).toBe(true);
    })
});