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
  linker: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

const Footer = (props) => {
  const { classes } = props;

  return (
    <footer className={classes.root}>
      <Typography variant="body2">
        @UniGoals {new Date().getFullYear()} -{' '}
        <a className={classes.linker} href="https://www.linkedin.com/in/stephen-lineker-miller/" target="_blank" rel="noopener noreferrer">
          @Creator
        </a>{' '}
      </Typography>
    </footer>
  );
};

Footer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Footer);
