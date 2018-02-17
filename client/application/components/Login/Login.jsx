import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Intent, Classes } from '@blueprintjs/core';
import * as _ from 'lodash';

import HomeSummary from '../Home/HomeSummary/HomeSummary';
import SampleTable from '../Home/HomeTables/SampleTable';

import toaster from '../../utils/toaster';
import { isMobileDevice } from '../../utils/utils';
import * as homePageData from './homePageData';
import * as constants from '../../utils/constants';

import style from './login.less';

export default class Login extends React.Component {
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

    this.state = {
      loading: isMobileDevice() === true,
      isMobile: isMobileDevice(),
    };

    this.authenticate = this.authenticate.bind(this);
    this.updateContentForUser = this.updateContentForUser.bind(this);
    this.handleAuthenticationError = this.handleAuthenticationError.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.loginWithExample = this.loginWithExample.bind(this);
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

  loginWithExample() {
    this.setState({ loading: true });
    this.props.firebase
      .getExampleUser()
      .then((content) => this.updateContentForUser(content, true))
      .catch((error) => this.handleAuthenticationError(error));
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
    toaster.danger(error.message);
    this.setState({ loading: false });
  }

  /**
   * Simple loading box if there is data processing happening, allows the user to know something
   * is happening int the background instead of it just sitting on the login screen.
   */
  loadingBox() {
    if (this.state.loading) {
      return (
        <div className={style.loadingIcon}>
          <Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />
        </div>
      );
    }
    return <div />;
  }

  loginBox() {
    const exampleUser = true;

    return (
      <div className={style.homeWrapper}>
        <header className={style.headerAlt}>
          <span className={style.homeLogo}>
            <img
              style={{ height: 250, margin: '0 15px' }}
              src="components/resources/images/logo.svg"
              alt="Logo"
            />
          </span>
          <h1>UniGoals</h1>
          <p>
            Full Course & Unit tracking<br />
            built by a University{' '}
            <a
              href="https://www.linkedin.com/in/stephen-lineker-miller/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Student
            </a>{' '}
            for University Students.<br />
            Version: {this.props.version}
          </p>
        </header>
        <div className={style.googleLoginButtonWrapper}>
          <div
            tabIndex={0}
            role="button"
            onKeyDown={this.loginWithGoogle}
            onClick={this.loginWithGoogle}
          >
            <img
              className={style.googleButton}
              src="components/resources/images/googleButton.png"
              alt="Sign in Google"
            />
          </div>
          <div
            tabIndex={0}
            role="button"
            onKeyDown={this.loginWithExample}
            onClick={this.loginWithExample}
          >
            <img
              className={style.googleButton}
              src="components/resources/images/exampleUser.png"
              alt="Example User"
            />
          </div>
        </div>
        <div className={`pt-card ${style.homeContainer}`}>
          UniGoals is a modern University unit tracking tool designed to let you know where you
          currently stand on your course. Using quick and simple percentages and charts to provide
          fast and accurate content about your course. Simply add your units with there weighting
          (e.g.coursework, exam, presentations, etc) and quickly see your current percent, average
          and total maximum grade! Real-time instant results.
          <div className={style.homeSummaryContainer}>
            <HomeSummary
              firebase={this.props.firebase}
              units={homePageData.units}
              profile={homePageData.profile}
              history={this.props.history}
              exampleUser={exampleUser}
              updateYearTitle={this.props.updateYearTitle}
              yearIndex="Year 1"
            />
          </div>
          Your own unqiue summary page that displays everything you need to quickly know about your
          units! Including your <strong>unit ranks</strong>, how they are compared to other units,
          <strong> Average</strong>, <strong>Max</strong> and <strong>Total Grade</strong>. Try
          hovering over the chart and percentages. Each unit looks like the one below, providing a{' '}
          <strong>Title</strong>, <strong>Name</strong>, <strong> Weighting</strong>, and
          <strong> Achieved</strong> column. Filling these will allow you to make the most of the
          site. The chart and percentages will also update in real time as you update the rows.
          <div className={`pt-card pt-elevation-3 ${style.homeTablesContainer}`}>
            <SampleTable
              tableNum={1}
              unit={homePageData.units[Object.keys(homePageData.units)[2]]}
              isSummary={exampleUser}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return this.loadingBox();
    }
    return this.loginBox();
  }
}

Login.propTypes = {
  updateYearTitle: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateYears: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  firebase: PropTypes.shape({
    getUserContent: PropTypes.func.isRequired,
    getAllYearUnits: PropTypes.func,
    updateLoginCountAndDate: PropTypes.func,
    getExampleUser: PropTypes.func,
    createNewUser: PropTypes.func,
    getProfileById: PropTypes.func,
    getUnitsById: PropTypes.func,
    getUserNotifications: PropTypes.func,
    provider: PropTypes.shape({}),
    authentication: PropTypes.shape({
      getRedirectResult: PropTypes.func,
      signInWithCredential: PropTypes.func,
    }),
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
};
