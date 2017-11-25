import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Intent, Classes } from '@blueprintjs/core';
import _ from 'lodash';

import toaster from '../../utils/toaster';
import style from './login.less';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.authenticateExamplesUser = this.authenticateExamplesUser.bind(this);
    this.loadingBox = this.loadingBox.bind(this);

    this.authenticateUser = this.authenticateUser.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.getUnits = this.getUnits.bind(this);

    const { search } = this.props.history.location;

    if (search === '?type=example') {
      this.authenticateExamplesUser();
    }

    this.state = {
      loading: search === '?type=example',
    };
  }

  /**
   * Takes the login result and generates the profile for the account, creating the users account
   * if they don't already exist
   * @param loginResult The google login result
   * @returns {Promise.<*>}
   */
  getAccountDetails(loginResult) {
    const selectionList = ['email', 'family_name', 'given_name', 'hd', 'name', 'picture', 'verified_email'];

    let profile = _.pick(loginResult.additionalUserInfo.profile, selectionList);
    const isNew = loginResult.additionalUserInfo.isNewUser;

    debugger;

    profile = Object.assign(profile, {
      token: loginResult.credential.accessToken,
      uid: loginResult.user.uid,
      university_id: profile.email.split('@')[0],
      hd: (_.isNil(profile.hd)) ? profile.email.split('@')[1] : profile.hd,
      new: isNew,
    });

    if (profile.new) {
      this.props.firebase.createNewUser(profile)
        .then(() => {
          this.props.updateProfile(profile);
          return Promise.resolve();
        })
        .catch(error => Promise.reject(error));
    } else {
      this.props.firebase.getProfileById()
        .then((gotProfile) => {
          this.props.updateProfile(gotProfile);
          return Promise.resolve();
        })
        .catch(error => Promise.reject(error));
    }
  }

  /**
   * gets the authenticating users units within a promise wrapper, updating the proops
   */
  getUnits() {
    this.props.firebase.getUnitsById()
      .then((units) => {
        this.props.updateUnits(units.val());
        return Promise.resolve();
      })
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
   * logs in with the example user accouont
   */
  authenticateExamplesUser() {
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
   * Authenticates a standard user
   */
  authenticateUser() {
    const auth = this.props.firebase.authentication;
    const { provider } = this.props.firebase;

    auth.signInWithPopup(provider)
      .then(result => this.getAccountDetails(result))
      .then(() => this.getUnits())
      .then(() => this.getNotifications())
      .catch(error => toaster.danger(error.message));
  }

  loadingBox() {
    if (this.state.loading) {
      return (
        <div className={style.loginPage}>
          <Spinner className={Classes.LARGE} intent={Intent.PRIMARY} />
        </div>
      );
    }
    return (<div />);
  }

  loginBox() {
    return (
      <div className={style.loginPage}>
        <div tabIndex={0} role="button" onKeyDown={this.clickGoogleButton} onClick={this.clickGoogleButton}>
          <button className={style.googleButton} onClick={this.authenticateUser}>
            Lets Get Started
          </button>
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
  firebase: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};
