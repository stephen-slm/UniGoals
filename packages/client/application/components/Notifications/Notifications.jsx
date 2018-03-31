import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

// Notification
import Notification from './Notification';

const styles = () => {};

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

    return (
      <div>
        {!_.isNil(notifications) &&
          _.map(notifications, (notification, index) => (
            <Notification
              notification={notification}
              keyIndex={index}
              firebase={this.props.firebase}
            />
          ))}
      </div>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  updateNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    getNotificationRef: PropTypes.func,
  }).isRequired,
};

Notifications.defaultProps = {};

export default withStyles(styles)(Notifications);
