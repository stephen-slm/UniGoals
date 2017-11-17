import _ from 'lodash';
import * as firebase from 'firebase';

export default class FirebaseWrapper {
  constructor(config) {
    this.configuration = config;

    firebase.initializeApp(this.configuration);

    this.database = firebase.database();
    this.authentication = firebase.auth();

    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  getExampleUser() {
    return this.database.ref('users/example').once('value');
  }

  getUnitsById() {
    const { uid } = this.authentication.currentUser;
    return this.database.ref(`users/${uid}/units`).once('value');
  }

  getUserById() {
    const { uid } = this.authentication.currentUser;
    return this.database.ref(`users/${uid}`).once('value');
  }

  createNewUser(profile) {
    const {
      email,
      family_name,
      given_name,
      hd,
      uid,
      name,
      picture,
    } = profile;

    this.database.ref(`users/${uid}`).set({
      uid,
      given_name,
      family_name,
      email,
      picture,
      name,
      hd,
      units: [{
        title: 'Sample',
        content: [
          ['Sample', '0', '0'],
        ],
      }],
    });

    return profile;
  }
}
