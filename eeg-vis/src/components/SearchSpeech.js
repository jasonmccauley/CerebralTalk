import React, { useState } from "react";
import { Typography, Button, Container, Select, MenuItem, FormControl, InputLabel, CircularProgress, Grid, Divider, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    select: {
      color: 'white',
      backgroundColor: 'transparent',
      width: '200px',
      '&:before': {
        borderColor: 'white',
      },
      '&:after': {
        borderColor: 'white',
      },
    },
}));

/*
this displays a dropdown with every imagined speech from the uploaded file
clicking an option displays the graph of the spectrogram for each sample that corresponds to that speech
*/
function SearchSpeech({ graphsBase64 }){
    const classes = useStyles();
    const [selectedSpeech, setSelectedSpeech] = useState("")

    // list of imagined speeches
    let keys = []

    // handling incase no props are passed
    if(graphsBase64){
        keys = Object.keys(graphsBase64)
    }
    return(
        <>
        {keys.length > 0 ?(
            <Grid item>
                <FormControl>
                    <InputLabel id="speech-label" style={{ color: 'white' }}>Select Imagined Speech:</InputLabel>
                    <Select 
                        labelId="speech-label" 
                        value={selectedSpeech} 
                        onChange={(event) => setSelectedSpeech(event.target.value)} 
                        className={classes.select}
                        IconComponent={(props) => <span {...props} style={{ color: 'rgb(197, 197, 246)' }}>&#9660;</span>}
                    >
                    {keys.map((key, index) => (
                        <MenuItem key={index} value={key}>{key}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                {/* Checks if a speech is selected and displays the corresponding  */}
                {selectedSpeech &&(
                    <img src={`data:image/jpeg;base64,${graphsBase64[selectedSpeech]}`} alt={`Graph for ${selectedSpeech}`} />
                )}
            </Grid>
        ):(
            <p>No imagined speech labels found</p> 
        )}
        </>
    )
}
export default SearchSpeech