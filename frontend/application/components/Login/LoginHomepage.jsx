import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Intent, Classes } from '@blueprintjs/core';
import _ from 'lodash';

import toaster from '../../utils/toaster';
import style from './login.less';
import { isMobileDevice } from '../../utils/utils';


export default class LoginHomepage extends React.Component {
  constructor(props) {
    super(props);

    this.loadingBox = this.loadingBox.bind(this);
    this.processGoogleLogin = this.processGoogleLogin.bind(this);
    this.authenticateExamplesUser = this.authenticateExamplesUser.bind(this);
    this.authenticateUserWithGoogle = this.authenticateUserWithGoogle.bind(this);

    this.state = {
      loading: isMobileDevice() === true,
      isMobile: isMobileDevice(),
    };


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

  processGoogleLogin(loginResult) {
    return new Promise((resolve, reject) => {
      const selectionList = ['email', 'family_name', 'given_name', 'hd', 'name', 'picture', 'verified_email'];

      let profile = _.pick(loginResult.additionalUserInfo.profile, selectionList);
      const isNew = loginResult.additionalUserInfo.isNewUser;

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
            return resolve();
          })
          .catch(error => reject(error));
      } else {
        this.props.firebase.getProfileById()
          .then((gotProfile) => {
            this.props.updateProfile(gotProfile);
            return resolve();
          })
          .catch(error => reject(error));
      }
    });
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

        this.setState({ loading: false });
      })
      .catch(error => toaster.danger(error.message));
  }

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
        <img style={{ height: 250, margin: '0 15px' }} src="components/resources/images/logo.png" alt="Logo" />
        <div style={{ margin: '0 auto' }}>
          <div tabIndex={0} role="button" onKeyDown={this.clickGoogleButton} onClick={this.authenticateUserWithGoogle}>
            <img className={style.googleButton} src="components/resources/images/googleButton.png" alt="Sign in Google" />
          </div>
          <div tabIndex={0} role="button" onKeyDown={this.clickGoogleButton} onClick={this.authenticateExamplesUser}>
            <img className={style.googleButton} src="components/resources/images/exampleUser.png" alt="Example User" />
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

LoginHomepage.propTypes = {
  updateNotifications: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  updateUnits: PropTypes.func.isRequired,
  firebase: PropTypes.shape().isRequired,
};
