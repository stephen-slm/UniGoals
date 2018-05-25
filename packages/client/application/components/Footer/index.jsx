/*
 * @File application\components\Profile\index.jsx
 * @Version 0.0.1
 */
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
});

const Footer = (props) => {
  const { classes } = props;

  return (
    <footer className={classes.root}>
      <Typography component="p">
        Made with <span style={{ color: '#e25555' }}>&#9829;</span> in the United Kingdom
      </Typography>
      <Typography component="p">
        by a{' '}
        <a href="https://www.linkedin.com/in/stephen-lineker-miller/" target="_blank" rel="noopener noreferrer">
          Student
        </a>{' '}
      </Typography>
      <Typography component="p">@UniGoals 2018</Typography>
    </footer>
  );
};

Footer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Footer);
