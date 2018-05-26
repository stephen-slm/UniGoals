import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

// Notification
import Notification from './Notification';
import NoNotifications from './NoNotifications';

import firebase from '../../utils/FirebaseWrapper';

const styles = () => ({
  root: {
    color: 'white',
    flexGrow: 1,
  },
});

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    const notificationRef = firebase.getNotificationRef();

    notificationRef.on('value', (snapshot) => {
      props.updateNotifications(snapshot.val());
    });
  }

  buildNotifications = (notifications) => {
    const builtNotifications = _.map(notifications, (notification, index) => (
      <Notification key={index} removeNotification={this.props.removeNotification} notification={notification} keyIndex={index} />
    ));

    return _.reverse(builtNotifications);
  };

  render() {
    const { classes, notifications } = this.props;

    if (_.isNil(Object.keys(notifications)[0])) {
      // If there is no noifications, render the no notifications panel
      return <NoNotifications showHelpBox={this.props.showHelpBox} />;
    }

    return <div className={classes.root}>{this.buildNotifications(notifications)}</div>;
  }
}

Notifications.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  showHelpBox: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  notifications: PropTypes.shape({}).isRequired,
};

Notifications.defaultProps = {};

export default withStyles(styles)(Notifications);
