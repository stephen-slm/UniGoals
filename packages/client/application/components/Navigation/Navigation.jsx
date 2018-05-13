import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';

// Bottom navigation
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';

// Linking
import { Link } from 'react-router-dom';

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
  mail: {
    marginRight: theme.spacing.unit,
  },
  logo: {
    width: 50,
    height: 50,
  },
  avatar: {
    width: 64,
    height: 64,
  },
  logoButton: {
    padding: '0px',
    minWidth: '0px',
  },
  BottomNavigation: {
    background: theme.palette.primary.main,
    color: 'white',
    width: '100%',
    position: 'fixed',
    zIndex: 100,
    right: 0,
    left: 0,
    bottom: 0,
  },
  bottomNavigationColor: {
    textDecoration: 'none',
    color: 'white',
  },
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotifications: false,
      showSignOut: false,
      invalidhelpMessage: false,
      notificationCount: 0,
    };

    this.getWelcomeMessage = this.getWelcomeMessage.bind(this);
    this.submitHelpMessage = this.submitHelpMessage.bind(this);
    this.showNotifications = this.showNotifications.bind(this);
    this.showSignOutBox = this.showSignOutBox.bind(this);
    this.signOut = this.signOut.bind(this);

    const notificationRef = props.firebase.getNotificationRef();

    notificationRef.on('value', (snapshot) => {
      this.setState({
        notificationCount: _.size(snapshot.val()),
      });
    });
  }

  getWelcomeMessage() {
    const time = new Date();
    const currentHour = time.getHours();
    const name = this.props.profile.name.split(' ')[0];

    if (currentHour < 12) return `Morning, ${name}`;
    if (currentHour < 18) return `Afternoon, ${name}`;
    return `Evening, ${name}`;
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
   * Displays the overlay for the sign out page.
   */
  showSignOutBox() {
    this.setState({
      showSignOut: !this.state.showSignOut,
    });
  }

  signOut() {
    /**
     * When this route is called, the user will be logged out of firebase (google), logging them
     * out of the application, then the profile of the user will be removed to stop caching
     * issue when they login. Finally the route address will be reset and the page reloaded.
     */
    this.props.firebase.authentication.signOut();
    this.props.removeProfile();
    this.props.history.go('/');
    window.location.reload();
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

    this.props.showHelpBox();

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
            handleClose={this.props.showHelpBox}
            open={this.props.displayHelp}
            minLength={constants.HELP_MESSAGE.MIN}
            maxLength={constants.HELP_MESSAGE.MAX}
          />
          <Toolbar>
            <Link href="/" to="/" style={{ textDecoration: 'none' }}>
              <img
                src="/components/resources/images/logo.svg"
                alt="logo"
                className={classes.logo}
              />
            </Link>
            <Typography variant="body2" color="inherit" className={classes.flex}>
              UniGoals
            </Typography>
            <Typography component="div" color="inherit">
              {this.getWelcomeMessage()}
            </Typography>
            <IconButton className={classes.bottomNavigationColor} onClick={this.showSignOutBox}>
              <Icon>exit_to_app</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        {!_.isNil(this.props.children) ? this.props.children : null}
        <BottomNavigation className={classes.BottomNavigation}>
          <Link href="/home" to="/home" style={{ textDecoration: 'none' }}>
            <BottomNavigationAction
              icon={<Icon className={classes.bottomNavigationColor}>home</Icon>}
            />
          </Link>
          <BottomNavigationAction
            onClick={this.props.showHelpBox}
            icon={<Icon className={classes.bottomNavigationColor}>help</Icon>}
          />
          <Link href="/notifications" to="/notifications" style={{ textDecoration: 'none' }}>
            <BottomNavigationAction
              icon={
                this.state.notificationCount > 0 ? (
                  <Badge badgeContent={this.state.notificationCount} color="error">
                    <Icon className={classes.bottomNavigationColor}>notifications</Icon>
                  </Badge>
                ) : (
                  <Icon className={classes.bottomNavigationColor}>notifications</Icon>
                )
              }
            />
          </Link>
        </BottomNavigation>
      </div>
    );
  }
}

Navigation.propTypes = {
  displayHelp: PropTypes.bool.isRequired,
  showHelpBox: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    sendHelpMessage: PropTypes.func,
    getNotificationRef: PropTypes.func,
    authentication: PropTypes.shape({
      signOut: PropTypes.func,
    }),
  }).isRequired,
  children: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  version: PropTypes.string.isRequired,
  removeProfile: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
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
