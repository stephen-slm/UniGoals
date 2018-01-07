import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { Popover, Position, PopoverInteractionKind, Dialog, Button } from '@blueprintjs/core';

import Notification from '../Home/Notifications/Notification';
import * as constants from '../../utils/constants';
import toaster from '../../utils/toaster';

const style = require('../Home/home.less');

export default class Navigation extends React.Component {
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

    const notificationRef = this.props.firebase.getNotificationRef();

    // Live notificaiton updates which are triggered every time a notification is added to the
    // users data entry
    notificationRef.on('value', (snapshot) => {
      this.props.updateNotifications(snapshot.val());
    });

    this.state = {
      showNotifications: false,
      showHelp: false,
      showSignOut: false,
      invalidhelpMessage: false,
    };
  }

  /**
   * Notificaitons are based on a state, adjusting the state will display the
   * notifications for the user.
   */
  showNotifications() {
    this.setState({
      showNotifications: !this.state.showNotifications,
    });
  }

  /**
   * Trigges the overlay for the signed in user when they click the help button
   */
  showHelpBox() {
    this.setState({
      showHelp: !this.state.showHelp,
    });
  }

  /**
   * Displays the overlay for the sign out page.
   */
  showSignOutBox() {
    this.setState({
      showSignOut: !this.state.showSignOut,
    });
  }

  /**
   * Adds a help message into the firebase help route, this route stores
   * the message, name, email and timestamp of user sending the help message
   */
  submitHelpMessage(e) {
    e.preventDefault();

    const message = this.helpText.value;
    const { name, email, given_name: givenName } = this.props.profile;
    const { version } = this.props;

    if (message.length < constants.HELP_MESSAGE.MIN
      || message.length > constants.HELP_MESSAGE_MAX) {
      return this.setState({ invalidhelpMessage: true });
    }


    this.showHelpBox();

    if (_.isNil(this.props.exampleUser) || !this.props.exampleUser) {
      // Generates a prefilled link for user generated form for submitting help, thiw will
      // be a google form.
      window.open('https://docs.google.com/forms/d/e/'
        + '1FAIpQLSfAZUIjg-jJEPlXLuzRVTpf6bIxGWqdI7HiC6YKVNp5r87Mvg/viewform?'
        + `usp=pp_url&entry.359427520=${name}&entry.1023136950=${email}&entry.114544494=`
        + `${message}&entry.457088105=${version}`, '_blank');

      this.setState({ invalidhelpMessage: false });

      return this.props.firebase.sendHelpMessage(message, name, email)
        .then(() => toaster.success(`Thank you ${givenName} for submitting your help and or question`))
        .catch(error => toaster.danger(error.message));
    }

    return toaster.warning('Sorry the example user cannot send help or feedback messages');
  }

  /**
   * Builds the notification jsx for the user, base on if the size of the notifications
   * are greater than 0 (there are actually notifications)
   */
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

      notifications = _.reverse(notifications);
    }

    return (
      <Popover interactionKind={PopoverInteractionKind.CLICK} position={Position.BOTTOM_RIGHT} >
        <button className={`pt-button pt-minimal pt-icon-notifications ${(_.size(this.props.notifications) > 0) ? style.notificationFlash : ''}`} />
        <div>
          {notifications}
        </div>
      </Popover>
    );
  }

  /**
   * Generates the help button button, which also includes the building of the help section and
   * submitting to the user.
   */
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
              maxLength={constants.HELP_MESSAGE.MAX}
              className={`pt-input .pt-fill ${(this.state.invalidhelpMessage) ? 'pt-intent-danger' : ''}`}
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

  /**
   * sign out button and display box for the user.
   */
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
              <Link href={this.props.routePaths.signOut} to={this.props.routePaths.signOut}>
                <Button
                  text="Yes"
                />
              </Link>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }


  render() {
    const { profile } = this.props;

    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">
              Uni Goals, Welcome {profile.name} - {profile.email.split('@')[0].toUpperCase()}, {profile.course_university}
            </div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <span className="pt-navbar-divider" />
            {this.buildNotifications()}
            {this.helpButton()}
            {this.signOutButton()}
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

Navigation.propTypes = {
  notifications: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    sendHelpMessage: PropTypes.func,
    getNotificationRef: PropTypes.func,
  }).isRequired,
  children: PropTypes.shape({}).isRequired,
  routePaths: PropTypes.shape().isRequired,
  exampleUser: PropTypes.bool,
  version: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    course_university: PropTypes.string,
    given_name: PropTypes.string,
  }).isRequired,
};

Navigation.defaultProps = {
  exampleUser: false,
};
