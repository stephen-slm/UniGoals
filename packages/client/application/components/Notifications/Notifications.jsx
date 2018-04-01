import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

import { Link } from 'react-router-dom';

// Notification
import Notification from './Notification';

const styles = theme => ({
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

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    const notificationRef = props.firebase.getNotificationRef();

    notificationRef.on('value', snapshot => {
      props.updateNotifications(snapshot.val());
    });
  }

  render() {
    const { classes, notifications } = this.props;

    if (_.isNil(Object.keys(notifications)[0])) {
      return (
        <div>
          <div className={classes.error}>
            <p className={classes.errorTitle}>No Notifications</p>
            <p className={classes.errorMessage}>
              Sorry there does not seem to be any notifications for you to view.
            </p>
            <p className={classes.errorSmall}>
              visit the{' '}
              <Link className={classes.linker} href="/" to="/">
                homepage
              </Link>{' '}
              or{' '}
              <span className={classes.linker} role="button" onClick={this.props.showHelpBox}>
                send a help message
              </span>{' '}
              if you expected something different
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {_.map(notifications, (notification, index) => (
          <Notification
            removeNotification={this.props.removeNotification}
            firebase={this.props.firebase}
            notification={notification}
            keyIndex={index}
          />
        ))}
      </div>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  showHelpBox: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  notifications: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    getNotificationRef: PropTypes.func,
  }).isRequired,
};

Notifications.defaultProps = {};

export default withStyles(styles)(Notifications);
