import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    color: 'white',
    flexGrow: 1,
  },
  error: {
    textAlign: 'center',
    maxWidth: '80%',
    margin: '0 auto',
    padding: `${theme.spacing.unit * 25} ${theme.spacing.unit * 5} ${theme.spacing.unit * 7}`,
  },
  errorTitle: {
    color: '#3b4450',
    marginBottom: theme.spacing.unit,
  },
  errorMessage: {
    color: 'inherit',
  },
  errorSmall: {
    color: 'inherit',
  },
  linker: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

const NoNotifications = (props) => {
  const { classes } = props;

  return (
    <div>
      <div className={classes.error}>
        <p className={classes.errorTitle}>No Notifications</p>
        <span role="img" aria-label="sad emoji" className={classes.errorTitle}>
          😢
        </span>
        <p className={classes.errorMessage}>
          Sorry there does not seem to be any notifications for you to view.
        </p>
        <p className={classes.errorSmall}>
          visit the{' '}
          <Link className={classes.linker} href="/" to="/">
            homepage
          </Link>{' '}
          or{' '}
          <span
            tabIndex={0}
            className={classes.linker}
            onClick={props.showHelpBox}
            onKeyPress={props.showHelpBox}
            role="button"
          >
            send a help message
          </span>{' '}
          if you expected something different
        </p>
      </div>
    </div>
  );
};

NoNotifications.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  showHelpBox: PropTypes.func.isRequired,
};

export default withStyles(styles)(NoNotifications);
