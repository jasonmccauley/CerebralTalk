import React, { useState, useEffect } from "react";
import { Button, Checkbox, FormControlLabel, Grid } from '@material-ui/core';

function ChannelSelector({ onChange, onAnalyzeClick, isLoading }) {
    // List of EEG channels, will always be the same
    const channelList = [
        ['Fp1', 'Fp2', 'F7', 'F3', 'Fz', 'F4', 'F8', 'FC5'], 
        ['FC1', 'FC2', 'FC6', 'T7', 'C3', 'Cz', 'C4', 'T8'],
        ['TP9', 'CP5', 'CP1', 'CP2', 'CP6', 'TP10', 'P7', 'P3'],
        ['Pz', 'P4', 'P8', 'PO9', 'O1', 'Oz', 'O2', 'PO10'],
        ['AF7', 'AF3', 'AF4', 'AF8', 'F5', 'F1', 'F2', 'F6'], 
        ['FT9', 'FT7', 'FC3', 'FC4', 'FT8', 'FT10', 'C5', 'C1'],
        ['C2', 'C6', 'TP7', 'CP3', 'CPz', 'CP4', 'TP8', 'P5'],
        ['P1', 'P2', 'P6', 'PO7', 'PO3', 'POz', 'PO4', 'PO8']
    ];

    // keeps track of checked statuses of each channel, all set to true by default
    const [checkedChannels, setCheckedChannels] = useState(() => {
        const initialCheckedChannels = {};
        channelList.forEach(row => {
            row.forEach(channel => {
                initialCheckedChannels[channel] = true; // all channels initially checked
            });
        });
        return initialCheckedChannels;
    });

    // updates checkedChannels when a checkbox is checked/unchecked
    const handleCheckboxChange = (event, channel) => {
        setCheckedChannels(prevCheckedChannels => ({
            ...prevCheckedChannels,
            [channel]: event.target.checked
        }));
    };
    
    // update parent component with list of channels the user wants removed
    useEffect(() => {
        onChange(getRemovedChannels());
    }, [checkedChannels]);

    // sends list of channels the user wants removed
    const getRemovedChannels = () => {
        const removedChannels = [];

        for (const [key, value] of Object.entries(checkedChannels)) {
            if(!value){
                removedChannels.push(key);
            }
        }

        return removedChannels;
    };
    
    // checks/unchecks all checkboxes
    const setAll = (value) => {
        setCheckedChannels(prevState => {
            const updatedCheckedChannels = {};
            Object.keys(prevState).forEach(channel => {
              updatedCheckedChannels[channel] = value;
            });
            return updatedCheckedChannels;
        });
    };

    return(
        <div>
            <Grid container spacing={2}>
                {channelList.map((channel1Dim, rowIndex) => (
                    <Grid item key={rowIndex}>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {channel1Dim.map((channel, itemIndex) => (
                                <li key={itemIndex}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checkedChannels[channel]}
                                                onChange={(event) => handleCheckboxChange(event, channel)}
                                                color="primary"
                                            />
                                        }
                                        label={channel}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Grid>
                ))}
            </Grid>

            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={() => setAll(true)} style={{ marginRight: '10px', backgroundColor: 'rgb(197, 197, 246)', fontWeight: 'bold' }}>Select all</Button>
                <Button variant="contained" color="primary" onClick={() => setAll(false)} style={{ backgroundColor: 'rgb(197, 197, 246)', fontWeight: 'bold' }}>Deselect all</Button>
            </div>
        </div>
    );
}

export default ChannelSelector;
