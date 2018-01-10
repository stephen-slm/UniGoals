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
      hd: (_.isNil(profile.hd)) ? profile.email.split('@')[1] : profile.hd,
      new: loginResult.additionalUserInfo.isNewUser,
    });
  }

  constructor(props) {
    super(props);

    this.loadingBox = this.loadingBox.bind(this);
    this.processGoogleLogin = this.processGoogleLogin.bind(this);
    this.authenticateExamplesUser = this.authenticateExamplesUser.bind(this);
    this.authenticateUserWithGoogle = this.authenticateUserWithGoogle.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    /**
     * Knowing the device is mobile is important to use a different authentication method, by
     * this we fix a problem related to mobile authetnication (slightly slower) but we also
     * then allow the faster one for pc always.
     */
    this.state = {
      loading: isMobileDevice() === true,
      isMobile: isMobileDevice(),
    };


    /**
     * if the user is on a mobile device (or we think they are) we have to listen for
     * redirction results to authenticate them into the system otherwise they won't
     * be able to use the database references
     */
    if (this.state.isMobile) {
      this.props.firebase.authentication.getRedirectResult()
        .then((loginResult) => {
          if (loginResult.credential) {
            this.props.firebase.authentication.signInWithCredential(loginResult.credential)
              .then(() => this.processGoogleLogin(loginResult))
              .then(() => this.getNotifications())
              .then(() => this.getUnits())
              .catch((error) => {
                toaster.danger(error.message);
                this.setState({ loading: false });
              });
          } else {
            this.setState({ loading: false });
          }
        });
    }
  }


  /**
   * Gets the units for the logged in user
   */
  getUnits() {
    this.props.firebase.getUnitsById()
      .then(units => this.props.updateUnits(units.val()))
      .catch(error => Promise.reject(error));
  }

  /**
   * gets the logging in users notifications
   */
  getNotifications() {
    this.props.firebase.getUserNotifications()
      .then((notifications) => {
        this.props.updateNotifications(notifications.val());
        return Promise.resolve();
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Takes in the loginResult from a google login, taking the important information and creating
   * the user if the user does not already exist.
   * @param {object} loginResult login result from google
   */
  processGoogleLogin(loginResult) {
    return new Promise((resolve, reject) => {
      const profile = Login.generateProfile(loginResult);

      if (profile.new) {
        this.props.firebase.createNewUser(profile)
          .then(() => this.updateProfile(profile))
          .then(() => resolve())
          .catch(error => reject(error));
      } else {
        this.props.firebase.getProfileById()
          .then(gotProfile => this.updateProfile(gotProfile))
          .then(() => resolve())
          .catch(error => reject(error));
      }
    });
  }

  /**
   * updates the users profile in redux
   * @param {object} profile the users profile information
   */
  updateProfile(profile) {
    this.props.updateProfile(profile);
    return Promise.resolve();
  }

  /**
   * logs in with the example user accouont
   */
  authenticateExamplesUser() {
    this.setState({ loading: true });

    this.props.firebase.getExampleUser()
      .then((snapshot) => {
        const exampleUser = snapshot.val();
        const { units } = exampleUser;

        const { profile, notifications } = exampleUser;
        profile.exampleUser = true;

        delete profile.units;

        this.props.updateNotifications(notifications);
        this.props.updateProfile(profile);
        this.props.updateUnits(units);
      })
      .catch(error => toaster.danger(error.message));
  }

  /**
   * Triggers the authentication steps when the user presses the login button
   */
  authenticateUserWithGoogle() {
    const auth = this.props.firebase.authentication;
    const { provider } = this.props.firebase;

    this.setState({ loading: true });

    if (this.state.isMobile) {
      auth.signInWithRedirect(provider);
    } else {
      auth.signInWithPopup(provider)
        .then(result => this.processGoogleLogin(result))
        .then(() => this.getNotifications())
        .then(() => this.getUnits())
        .catch((error) => {
          toaster.danger(error.message);
          this.setState({ loading: false });
        });
    }
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
    return (<div />);
  }

  loginBox() {
    const exampleUser = true;

    return (
      <div className={style.homeWrapper}>
        <header className={style.headerAlt}>
          <span className={style.homeLogo}><img style={{ height: 250, margin: '0 15px' }} src="components/resources/images/logo.png" alt="Logo" /></span>
          <h1>UniGoals</h1>
          <p>Full Course & Unit tracking<br />
            built by a University <a href="https://www.linkedin.com/in/stephen-lineker-miller/" target="_blank" rel="noopener noreferrer">Student</a> for University Students.<br />
            Version: {this.props.version}
          </p>
        </header>
        <div className={style.googleLoginButtonWrapper}>
          <div tabIndex={0} role="button" onKeyDown={this.clickGoogleButton} onClick={this.authenticateUserWithGoogle}>
            <img className={style.googleButton} src="components/resources/images/googleButton.png" alt="Sign in Google" />
          </div>
          <div tabIndex={0} role="button" onKeyDown={this.clickGoogleButton} onClick={this.authenticateExamplesUser}>
            <img className={style.googleButton} src="components/resources/images/exampleUser.png" alt="Example User" />
          </div>
        </div>
        <div className={`pt-card ${style.homeContainer}`}>
          UniGoals is a modern University unit tracking tool designed to let you know where
          you currently stand on your course. Using quick and simple percentages and charts
          to provide fast and accurate content about your course. Simply add your units with
          there weighting (e.g.coursework, exam, presentations, etc) and quickly see your
          current percent, average and total maximum grade! Real-time instant results.
          <div className={style.homeSummaryContainer}>
            <HomeSummary
              units={homePageData.units}
              profile={homePageData.profile}
              history={this.props.history}
              exampleUser={exampleUser}
            />
          </div>
          Your own unqiue summary page that displays everything you need to quickly know about your
          units! Including your <strong>unit ranks</strong>, how they are compared to other units,
          <strong> Average</strong>, <strong>Max</strong> and <strong>Total Grade</strong>. Try
          hovering over the chart and percentages. Each unit looks like the one below, providing
          a <strong>Title</strong>, <strong>Name</strong>, <strong> Weighting</strong>, and
          <strong> Achieved</strong> column. Filling these will allow you to make the most of
          the site. The chart and percentages will also update in real time as you update the rows.
          <div className={`pt-card pt-elevation-3 ${style.homeTablesContainer}`}>
            <SampleTable
              tableNum={1}
              unit={homePageData.units[Object.keys(homePageData.units)[2]]}
              exampleUser={exampleUser}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (this.loadingBox());
    }
    return this.loginBox();
  }
}

Login.propTypes = {
  updateNotifications: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateUnits: PropTypes.func.isRequired,
  version: PropTypes.string.isRequired,
  firebase: PropTypes.shape({
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
