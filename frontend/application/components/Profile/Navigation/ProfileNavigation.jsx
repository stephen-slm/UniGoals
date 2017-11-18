import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Popover, Position, PopoverInteractionKind, Dialog, Button, Intent } from '@blueprintjs/core';

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

    this.showHelpBox();

    const text = this.helpText.value;
    const { name, email } = this.profile;

    // TODO: complete the backend so this works
    toaster.warning('Question service is currently in the works!');
  }

  buildNotifications() {
    let notifications = (<pre>No Notifications</pre>);

    if (!_.isNil(this.props.notifications) && !_.isNil(this.props.notifications[0])) {
      notifications = _.map(this.props.notifications, (notification, index) =>
        (<Notification key={index} title={notification.title} content={notification.message} />),
      );
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
            <textarea ref={(ref) => { this.helpText = ref; }} rows={10} cols={70} className="pt-input .pt-fill" dir="auto" defaultValue="If you have any problems or help please ask below and I will email you back!" />
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
                onClick={this.signOut}
                text="Yes"
              />
              <Button
                onClick={this.showSignOutBox}
                text="No"
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
            <div className="pt-navbar-heading">Uni Stats, Welcome {this.profile.name} - {this.profile.email.split("@")[0].toUpperCase()}</div>
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
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  history: PropTypes.shape().isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};
