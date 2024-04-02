import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'rgb(197, 197, 246)',
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    marginRight: theme.spacing(2),
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Button component={Link} to="/home" className={classes.link}>Home</Button>
          <Button component={Link} to="/about" className={classes.link}>About</Button>
          <Button component={Link} to="/eegdata" className={classes.link}>EEG</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
