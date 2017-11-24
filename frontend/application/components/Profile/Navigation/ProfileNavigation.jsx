import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Popover, Position, PopoverInteractionKind, Dialog, Button } from '@blueprintjs/core';

import Notification from '../Notifications/Notification';
import toaster from '../../../utils/toaster';


export default class ProfileNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.profile = this.props.profile;

    this.buildNotifications = this.buildNotifications.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
    this.submitHelpMessage = this.submitHelpMessage.bind(this);

    this.showHelpBox = this.showHelpBox.bind(this);
    this.showSignOutBox = this.showSignOutBox.bind(this);

    this.helpButton = this.helpButton.bind(this);
    this.signOutButton = this.signOutButton.bind(this);
    this.signOut = this.signOut.bind(this);

    this.state = {
      showNotifications: false,
      showHelp: false,
      showSignOut: false,
    };
  }

  showNotifications() {
    this.setState({
      showNotifications: !this.state.showNotifications,
    });
  }

  showHelpBox() {
    this.setState({
      showHelp: !this.state.showHelp,
    });
  }

  showSignOutBox() {
    this.setState({
      showSignOut: !this.state.showSignOut,
    });
  }

  signOut(e) {
    e.preventDefault();
    this.props.history.push('/signout');
  }

  submitHelpMessage(e) {
    e.preventDefault();

    const message = this.helpText.value;
    const { name, email } = this.props.profile;
    const givenName = this.props.profile.given_name;

    this.showHelpBox();

    if (_.isNil(this.props.profile.exampleUser)) {
      this.props.firebase.sendHelpMessage(message, name, email)
        .then(() => toaster.success(`Thank you ${givenName} for submitting your help and or question`))
        .catch(error => toaster.danger(error.message));
    } else {
      toaster.warning('Sorry the example user cannot send help or feedback messages');
    }
  }


  buildNotifications() {
    let notifications = (<pre>No Notifications</pre>);

    if (_.size(this.props.notifications) > 0) {
      notifications = _.map(this.props.notifications, (notification, index) =>
        (<Notification
          key={index}
          keyIndex={index}
          title={notification.title}
          message={notification.message}
          firebase={this.props.firebase}
          removeNotification={this.props.removeNotification}
          exampleUser={this.props.exampleUser}
        />));
    }

    return (
      <Popover interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM_RIGHT} >
        <button className="pt-button pt-minimal pt-icon-notifications" />
        <div>
          {notifications}
        </div>
      </Popover>
    );
  }

  helpButton() {
    return (
      <div>
        <button className="pt-button pt-minimal pt-icon-help" onClick={this.showHelpBox} />
        <Dialog
          isOpen={this.state.showHelp}
          onClose={this.showHelpBox}
          title="Send Question / feedback"
        >
          <div className="pt-dialog-body">
            <textarea
              ref={(ref) => { this.helpText = ref; }}
              rows={10}
              cols={70}
              maxLength={500}
              className="pt-input .pt-fill"
              dir="auto"
              placeholder="If you have any problems or help please ask below and I will email you back!"
            />
          </div>
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button
                onClick={this.submitHelpMessage}
                text="Submit Question"
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  signOutButton() {
    return (
      <div>
        <button className="pt-button pt-minimal pt-icon-log-out" onClick={this.showSignOutBox} />
        <Dialog
          isOpen={this.state.showSignOut}
          onClose={this.showSignOutBox}
          title="Signing out"
        >
          <div className="pt-dialog-body">
            Are you sure you want to sign out?
          </div>
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <Button
                onClick={this.showSignOutBox}
                text="No"
              />
              <Button
                onClick={this.signOut}
                text="Yes"
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }


  render() {
    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Uni Stats, Welcome {this.profile.name} - {this.profile.email.split('@')[0].toUpperCase()}</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-user" />
            <span className="pt-navbar-divider" />
            {this.buildNotifications()}
            {this.helpButton()}
            {this.signOutButton()}
          </div>
        </nav>
      </div>
    );
  }
}

ProfileNavigation.propTypes = {
  notifications: PropTypes.shape().isRequired,
  firebase: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    given_name: PropTypes.string,
    exampleUser: PropTypes.bool,
  }).isRequired,
};
