import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Intent, Classes } from '@blueprintjs/core';
import _ from 'lodash';

import * as Promise from 'bluebird';

import toaster from '../../utils/toaster';
import style from './login.less';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.googleLogin = this.googleLogin.bind(this);
    this.loadingBox = this.loadingBox.bind(this);

    const { search } = this.props.history.location;

    if (search === '?type=example') {
      this.props.firebase.getExampleUser()
        .then((snapshot) => {
          const exampleUser = snapshot.val();
          const { units } = exampleUser;

          const { profile } = exampleUser;
          profile.token = '';
          delete profile.units;

          this.props.updateProfile(profile);
          this.props.updateUnits(units);
        })
        .catch(error => toaster.danger(error.message));
    }

    this.state = {
      loading: search === '?type=example',
    };
  }

  generateAccountDetails(result) {
    const profilePickList = ['email', 'family_name', 'given_name', 'hd', 'name', 'picture', 'verified_email'];
    const profile = _.pick(result.additionalUserInfo.profile, profilePickList);
    const isNew = result.additionalUserInfo.isNewUser;

    profile.token = result.credential.accessToken;
    profile.uid = result.user.uid;
    profile.university_id = profile.email.split('@')[0];

    if (profile.hd !== 'myport.ac.uk') {
      throw new Error('Sorry, currently only University of Portsmouth students allowed');
    } else if (!profile.verified_email) {
      throw new Error(`Account ${profile.mail} has not verified there email.`);
    } else if (isNew) {
      return this.props.firebase.createNewUser(profile);
    }
    return this.props.firebase.getProfileById();
  }

  googleLogin() {
    this.setState({ loading: true }); // TODO: move this into the backend check when it is workings

    const auth = this.props.firebase.authentication;
    const { provider } = this.props.firebase;

    auth.signInWithPopup(provider)
      .then(result => this.generateAccountDetails(result))
      .then((result) => {
        const profile = result.val();
        toaster.success(`Authenticated user ${profile.email}`);
        this.props.updateProfile(profile);
        return this.props.firebase.getUnitsById();
      })
      .then(units => this.props.updateUnits(units.val()))
      .catch((error) => {
        this.setState({ loading: false });
        toaster.danger(error.message);
      });
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
          <button className={style.googleButton} onClick={this.googleLogin}>Lets Get Started</button>
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
  updateProfile: PropTypes.func.isRequired,
  updateUnits: PropTypes.func.isRequired,
  firebase: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};
