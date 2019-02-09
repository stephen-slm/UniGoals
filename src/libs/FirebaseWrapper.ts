import firebase from 'firebase';
import _ from 'lodash';

import * as constants from '../utils/constants';

interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

let instance: FirebaseWrapper | null = null;

class FirebaseWrapper {
  public authentication!: firebase.auth.Auth;

  private database!: firebase.database.Database;
  private configuration!: IFirebaseConfig;

  constructor(config: IFirebaseConfig) {
    if (!_.isNil(instance)) return instance;

    this.configuration = config;
    firebase.initializeApp(this.configuration);

    this.database = firebase.database();
    this.authentication = firebase.auth();

    instance = this;
  }

  /**
   * Authenticate the user with the provider based on mobile status.
   * @param {bool} mobile if the authentication device is mobile.
   * @param {firebase.auth.AuthProvider} provider provider to authenticate with.
   */
  async authenticateAsync(mobile: boolean = false, provider: firebase.auth.AuthProvider) {
    if (mobile) {
      return await this.authentication.signInWithRedirect(provider);
    } else {
      return await this.authentication.signInWithPopup(provider);
    }
  }

  /**
   * Authenticates the user with Google.
   * @param {bool} mobile if the authentication device is mobile.
   */
  async authenticateWithGoogleAsync(mobile: boolean | undefined = false) {
    return await this.authenticateAsync(mobile, this.getAuthenticationProvider('google'));
  }

  /**
   * Authenticates the user with Github.
   * @param {bool} mobile if the authentication device is mobile.
   */
  async authenticateWithGithubAsync(mobile: boolean | undefined = false) {
    return await this.authenticateAsync(mobile, this.getAuthenticationProvider('github'));
  }

  /**
   * Authenticates the user with Facebook.
   * @param {bool} mobile if the authentication device is mobile.
   */

  async authenticateWithFacebookAsync(mobile: boolean | undefined = false) {
    return await this.authenticateAsync(mobile, this.getAuthenticationProvider('facebook'));
  }

  /**
   * Gets the given authentication provider for the given user.
   * @param name the authentication provider name.
   */
  getAuthenticationProvider(name: string) {
    switch (name) {
      case 'facebook':
        return new firebase.auth.FacebookAuthProvider();
      case 'google':
        return new firebase.auth.GoogleAuthProvider();
      case 'github':
        return new firebase.auth.GithubAuthProvider();
      default:
        return new firebase.auth.GoogleAuthProvider();
    }
  }

  /**
   * Gets the current active users uid which is used to reference in the database
   */
  getUid() {
    return !_.isNil(this.authentication.currentUser) ? this.authentication.currentUser.uid : null;
  }

  /**
   * returns the full path to the image of the users profile picture
   */
  getProfileImageUrl() {
    if (!_.isNil(this.authentication.currentUser)) {
      return this.authentication.currentUser.photoURL;
    }
    return '';
  }

  /**
   * returns the current user
   */
  getCurrentUser(): firebase.User | null {
    return this.authentication.currentUser;
  }

  /**
   * Gets the notification reference that is used for live notification updates.
   */
  getNotificationReference() {
    return this.database.ref(`/users/${this.getUid()}/notifications`);
  }

  // returns all the users content
  async getUserContent() {
    const user = await this.database.ref(`users/${this.getUid()}`).once('value');
    return user.val();
  }

  /**
   * Gets the active users profile
   */
  async getProfileByIdAsync() {
    return await this.database.ref(`users/${this.getUid()}/profile`).once('value');
  }

  /**
   * deletes the current account
   */
  async deleteAccountAsync() {
    const currentUser = this.getCurrentUser();

    await this.database.ref(`users/${this.getUid()}`).remove();
    if (!_.isNil(currentUser)) await currentUser.delete();

    return this.authentication.signOut();
  }

  /**
   * Builds the profile up that would be used to create users while also can be used for displaying
   * data if its not required from the server when making the first gather of information.
   */
  generateProfileFromLogin() {
    const { currentUser } = this.authentication;
    const profileSelectionList = constants.PROFILE_SELECTION;
    const profile = _.pick(currentUser, profileSelectionList);

    return profile;
  }

  /**
   * creates a new user for which is called when a new sign in user happens
   */
  async createNewUserAsync() {
    const profile = this.generateProfileFromLogin();

    const created = await this.database.ref(`users/${this.getUid()}/profile`).set({
      email: profile.email,
      name: profile.displayName,
      last_login: Date.now(),
      new: true
    });

    return created;
  }
}

export default new FirebaseWrapper({
  apiKey: 'AIzaSyDBSpRMIl4olTWN0AOMCTMVqeIVkhGio_8',
  authDomain: 'organic-lacing-185810.firebaseapp.com',
  databaseURL: 'https://organic-lacing-185810.firebaseio.com',
  projectId: 'organic-lacing-185810',
  storageBucket: 'organic-lacing-185810.appspot.com',
  messagingSenderId: '40609903553'
});
