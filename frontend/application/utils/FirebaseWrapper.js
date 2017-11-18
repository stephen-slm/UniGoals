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

  getUid() {
    return this.authentication.currentUser.uid;
  }

  getExampleUser() {
    return this.database.ref('users/example').once('value');
  }

  getUnitsById() {
    return this.database.ref(`users/${this.getUid()}/units`).once('value');
  }

  getProfileById() {
    return this.database.ref(`users/${this.getUid()}/profile`).once('value');
  }

  updateUnitTitle(change, key) {
    return this.database.ref(`users/${this.getUid()}/units/${key}/title`).set(change);
  }

  updateUnitRowWeighting(change, unitKey, contentKey) {
    return this.database.ref(`users/${this.getUid()}/units/${unitKey}/content/${contentKey}/weighting`).set(change);
  }

  updateUnitRowArchived(change, unitKey, contentKey) {
    return this.database.ref(`users/${this.getUid()}/units/${unitKey}/content/${contentKey}/archived`).set(change);
  }

  updateUnitRowName(change, unitKey, contentKey) {
    return this.database.ref(`users/${this.getUid()}/units/${unitKey}/content/${contentKey}/name`).set(change);
  }

  updateUnitRowSection(change, tableIndex, rowIndex, columnIndex) {
    return this.database.ref(`users/${this.getUid()}/units/${tableIndex}/content/${rowIndex}/${columnIndex}`).set(change);
  }

  deleteUnitRowById(unitRowKey, tableUnitKey) {
    return this.database.ref(`users/${this.getUid()}/units/${tableUnitKey}/content/${unitRowKey}`).remove();
  }

  insertUnitById() {
    const insertUnitRef = this.database.ref(`users/${this.getUid()}/units`);
    const insertKey = insertUnitRef.push({ title: '', content: {} });
    return Promise.resolve(insertKey.key);
  }

  insertUnitRowById(unitKey) {
    const insertingUnitRowRef = this.database.ref(`users/${this.getUid()}/units/${unitKey}/content`);
    const insertingUnitRowKey = insertingUnitRowRef.push({ name: '', weighting: '0', archived: '0' });
    return Promise.resolve(insertingUnitRowKey.key);
  }

  deleteUnitById(unitIndex) {
    return this.database.ref(`users/${this.getUid()}/units/${unitIndex}`).remove();
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
      profile: {
        uid,
        given_name,
        family_name,
        email,
        picture,
        name,
        hd,
      },
      units: { key1: { title: '', content: { key1: { name: '', weighting: '0', archived: '0' } } } },
    });

    return Promise.resolve(profile);
  }
}
