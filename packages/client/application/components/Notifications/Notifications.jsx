import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

// Notification
import Notification from './Notification';
import NoNotifications from './NoNotifications';

const styles = () => ({
  root: {
    color: 'white',
    flexGrow: 1,
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
      // If there is no noifications, render the no notifications panel
      return <NoNotifications showHelpBox={this.props.showHelpBox} />;
    }

    return (
      <div className={classes.root}>
        {_.map(notifications, (notification, index) => (
          <Notification
            key={index}
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
