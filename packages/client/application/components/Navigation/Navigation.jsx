import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui-icons/Help';
import ExitIcon from 'material-ui-icons/ExitToApp';

import SignOutBox from './SignOutBox';
import HelpBox from './HelpBox';

import * as constants from '../../utils/constants';

const styles = (theme) => ({
  root: {
    color: 'white',
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    color: 'white',
    marginLeft: -12,
    marginRight: 20,
  },
  mail: {
    marginRight: theme.spacing.unit,
  },
});

class Navigation extends React.Component {
  constructor(props) {
    super();

    this.state = {
      showNotifications: false,
      showHelp: false,
      showSignOut: false,
      invalidhelpMessage: false,
    };

    this.submitHelpMessage = this.submitHelpMessage.bind(this);
    this.signOut = this.signOut.bind(this);

    this.showNotifications = this.showNotifications.bind(this);
    this.showHelpBox = this.showHelpBox.bind(this);
    this.showSignOutBox = this.showSignOutBox.bind(this);

    const notificationRef = props.firebase.getNotificationRef();

    // Live notificaiton updates which are triggered every time a notification is added to the
    // users data entry
    notificationRef.on('value', (snapshot) => {
      props.updateNotifications(snapshot.val());
    });
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

  signOut() {
    this.props.history.go('/signout');
  }

  /**
   * Adds a help message into the firebase help route, this route stores
   * the message, name, email and timestamp of user sending the help message
   */
  submitHelpMessage(message) {
    const { name, email, given_name: givenName } = this.props.profile;
    const { version } = this.props;

    if (
      message.length < constants.HELP_MESSAGE.MIN ||
      message.length > constants.HELP_MESSAGE_MAX
    ) {
      return this.setState({ invalidhelpMessage: true });
    }

    this.showHelpBox();

    // Generates a prefilled link for user generated form for submitting help, thiw will
    // be a google form.
    window.open(
      'https://docs.google.com/forms/d/e/' +
        '1FAIpQLSfAZUIjg-jJEPlXLuzRVTpf6bIxGWqdI7HiC6YKVNp5r87Mvg/viewform?' +
        `usp=pp_url&entry.359427520=${name}&entry.1023136950=${email}&entry.114544494=` +
        `${message}&entry.457088105=${version}`,
      '_blank',
    );

    this.setState({ invalidhelpMessage: false });

    return this.props.firebase
      .sendHelpMessage(message, name, email)
      .then(() => console.log(`Thank you ${givenName} for submitting your help and or question`))
      .catch((error) => console.log(error.message));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="static" color="primary" className={classes.root}>
          <SignOutBox
            onClose={this.showSignOutBox}
            onSignOut={this.signOut}
            open={this.state.showSignOut}
            name={this.props.profile.name}
          />
          <HelpBox
            handleSubmit={this.submitHelpMessage}
            error={this.state.invalidhelpMessage}
            handleClose={this.showHelpBox}
            open={this.state.showHelp}
            minLength={constants.HELP_MESSAGE.MIN}
            maxLength={constants.HELP_MESSAGE.MAX}
          />
          <Toolbar>
            <Typography variant="body2" color="inherit" className={classes.flex}>
              Uni Goals, {this.props.profile.name} - {this.props.profile.course_university}
            </Typography>
            <div>
              <IconButton color="inherit" onClick={this.showHelpBox}>
                <HelpIcon />
              </IconButton>
              <IconButton aria-haspopup="true" onClick={this.showSignOutBox} color="inherit">
                <ExitIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  // notifications: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    sendHelpMessage: PropTypes.func,
    getNotificationRef: PropTypes.func,
  }).isRequired,
  children: PropTypes.shape({}).isRequired,
  version: PropTypes.string.isRequired,
  // removeNotification: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    course_university: PropTypes.string,
    given_name: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    go: PropTypes.func,
  }).isRequired,
};

Navigation.defaultProps = {};

export default withStyles(styles)(Navigation);
