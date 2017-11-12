import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner, Intent, Classes } from '@blueprintjs/core';
import GoogleLogin from 'react-google-login';


import toaster from '../../utils/toaster';


import style from './login.less';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.googleLogin = this.googleLogin.bind(this);
    this.clickGoogleButton = this.clickGoogleButton.bind(this);
    this.loadingBox = this.loadingBox.bind(this);


    // // Using this to skip the login process TODO: Remove this at the end
    // this.props.updateProfile({
    //   googleId: '102254737472284537992',
    //   imageUrl: 'https://lh6.googleusercontent.com/-XDJleWPa82c/AAAAAAAAAAI/AAAAAAAAAAc/6lWzFna5fQc/s96-c/photo.jpg',
    //   email: 'up840877@myport.ac.uk',
    //   familyName: 'Lineker-miller',
    //   name: 'Stephen Lineker-miller',
    //   givenName: 'Stephen',
    //   token: 'token',
    // });

    this.state = {
      loading: false,
    };
  }


  googleLogin(response) {
    this.setState({ loading: false }); // TODO: move this into the backend check when it is workings

    const profile = response.profileObj;
    profile.token = response.getAuthResponse().id_token;

    const { google } = this.props;

    if (profile.email.split('@')[1] !== 'myport.ac.uk') {
     toaster.danger('Sorry, currently only University of Portsmouth students allowed');
    } else {
      this.props.updateProfile(profile);
    }

    // TODO: send to the backend and then verify that its a valid google account: https://developers.google.com/identity/sign-in/web/backend-auth
    google.authenticate(profile)
      .then((result) => {
        toaster.success(result.message);
        this.props.updateProfile(result.content.profile);
        // TODO: check if there a new user otherwise move them onto there profile page
      })
      .catch(error => toaster.danger(error.description));
  }

  clickGoogleButton(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.googleButton.signIn();
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
          <GoogleLogin
            ref={(googleButton) => { this.googleButton = googleButton; }}
            clientId="40609903553-c60s8f5l9b50hqg3gi4gu1a1t2hf83e6.apps.googleusercontent.com"
            className={style.googleButton}
            onSuccess={this.googleLogin}
            onFailure={this.googleLogin}
          />
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
  google: PropTypes.shape().isRequired,
  updateProfile: PropTypes.func.isRequired,
};
