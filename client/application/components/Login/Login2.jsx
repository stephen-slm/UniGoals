import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';

import * as homePageData from './homePageData';
import { isMobileDevice } from '../../utils/utils';
import * as constants from '../../utils/constants';

import Summary from '../Summary/Summary';
import UnitTable from '../Table/Table';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
  },
  card: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 300,
    maxWidth: '60%',
    margin: '0 auto',
  },
  text: {
    textAlign: 'justify',
  },
  loading: {
    marginTop: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Login extends React.Component {
  /**
   * takes the google login and generates a users profile from the data
   * @param {object} loginResult Google login result
   */
  static generateProfile(loginResult) {
    const selectionList = constants.PROFILE_SELECTION;
    const profile = _.pick(loginResult.additionalUserInfo.profile, selectionList);

    return Object.assign(profile, {
      token: loginResult.credential.accessToken,
      hd: _.isNil(profile.hd) ? profile.email.split('@')[1] : profile.hd,
      new: loginResult.additionalUserInfo.isNewUser,
    });
  }

  constructor() {
    super();

    this.authenticate = this.authenticate.bind(this);
    this.updateContentForUser = this.updateContentForUser.bind(this);
    this.handleAuthenticationError = this.handleAuthenticationError.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);

    this.state = {
      loading: isMobileDevice() === true,
      isMobile: isMobileDevice(),
      isExample: true,
    };
  }

  // Checks to see if its a redirect with content
  componentDidMount() {
    if (this.state.isMobile) {
      let loginContent = null;

      this.props.firebase.authentication
        .getRedirectResult()
        .then((login) => {
          loginContent = login;
          if (_.isNil(login.credential)) return Promise.resolve();
          return this.props.firebase.authentication.signInWithCredential(loginContent.credential);
        })
        .then(() => this.authenticate(loginContent))
        .then(() => this.setState({ loading: false }))
        .catch((error) => this.handleAuthenticationError(error));
    }
  }

  /**
   * Updates the users content in redux
   * @param {object} user firebase user content
   * @param {boolean} example if is a exmaple user
   */
  updateContentForUser(user, example = false) {
    const content = user;
    content.profile.exampleUser = example;

    this.props.updateProfile(content.profile);
    this.props.updateYears(content.years);
    this.props.updateNotifications(content.notifications);
    return Promise.resolve();
  }

  // Handles all errors through a single promise
  handleAuthenticationError(error) {
    console.log(error.message);
    this.setState({ loading: false });
  }

  // proceeds to process the login details, creating accounts if needed and handling content
  authenticate(login) {
    if (_.isNil(login.credential)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const profile = Login.generateProfile(login);

      if (profile.new) {
        this.props.firebase
          .createNewUser(profile)
          .then(() => this.props.firebase.getUserContent())
          .then((content) => this.updateContentForUser(content))
          .then(() => this.props.firebase.updateLoginCountAndDate())
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        this.props.firebase
          .getUserContent()
          .then((content) => this.updateContentForUser(content))
          .then(() => this.props.firebase.updateLoginCountAndDate())
          .then(() => resolve())
          .catch((error) => reject(error));
      }
    });
  }

  loginWithGoogle() {
    const { provider, authentication: auth } = this.props.firebase;

    this.setState({ loading: true });

    if (this.state.isMobile) {
      auth.signInWithRedirect(provider);
    } else {
      auth
        .signInWithPopup(provider)
        .then((login) => this.authenticate(login))
        .catch((error) => this.handleAuthenticationError(error));
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <CircularProgress className={classes.progress} color="primary" size={80} />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <img style={{ height: 150 }} src="components/resources/images/logo.svg" alt="Logo" />
        <Typography variant="display1" gutterBottom>
          UniGoals
        </Typography>
        <Typography variant="subheading" gutterBottom>
          <Typography component="p">
            Full Course &amp; Unit tracking<br />built by a University{' '}
            <a
              href="https://www.linkedin.com/in/stephen-lineker-miller/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Student
            </a>{' '}
            for University Students
            <br />
            Version: {this.props.version}
          </Typography>
        </Typography>
        <Button variant="raised" color="primary" onClick={this.loginWithGoogle}>
          Login | Register
        </Button>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.text} compnent="p">
              UniGoals is a modern University unit tracking tool designed to let you know where you
              currently stand on your course. Using quick and simple percentages charts to provide
              fast and accurate content about your course. Simply add your units with there
              weighting (e.g.coursework, exam, presentations, etc) and quickly see your current
              percent, average and total maximum grade! Real-time instant results.
            </Typography>
            <Summary
              units={homePageData.units}
              profile={homePageData.profile}
              history={this.props.history}
              isExample={this.state.isExample}
              yearIndex="Year 1"
              yearTitle="Example Year"
            />
            <Typography className={classes.text} compnent="p">
              Your own unqiue summary page that displays everything you need to quickly know about
              your units! Including your <strong>unit ranks</strong>, how they are compared to other
              units, <strong> Average</strong>, <strong>Max</strong> and
              <strong>Total Grade</strong>. Try hovering over the chart and percentages. Each unit
              looks like the one below, providing a <strong>Title</strong>,
              <strong>Name</strong>, <strong>Weighting</strong>, and
              <strong> Achieved</strong> column. Filling these will allow you to make the most of
              the site. The chart and percentages will also update in real time as you update the
              rows.
            </Typography>
            <UnitTable
              yearIndex="example"
              tableIndex="example"
              firebase={this.props.firebase}
              unit={homePageData.units[Object.keys(homePageData.units)[2]]}
              isExample={this.state.isExample}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.shape({
    provider: PropTypes.shape({}),
    authentication: PropTypes.shape({
      getRedirectResult: PropTypes.func,
      signInWithCredential: PropTypes.func,
    }),
    createNewUser: PropTypes.func,
    getUserContent: PropTypes.func,
    updateLoginCountAndDate: PropTypes.func,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  version: PropTypes.string.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
};

Login.defaultProps = {};

export default withStyles(styles)(Login);
