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

  getUserById() {
    return this.database.ref(`users/${this.getUid()}`).once('value');
  }

  updateUnitTitle(change, unitIndex) {
    return this.database.ref(`users/${this.getUid()}/units/${unitIndex}/title`).set(change);
  }

  updateUnitRowById(change, unitIndex, rowIndex, columnIndex) {
    return this.database.ref(`users/${this.getUid()}/units/${unitIndex}/content/${rowIndex}/${columnIndex}`).set(change);
  }

  deleteUnitRowById(rowIndex, unitIndex) {
    const removingUnitRowRef = this.database.ref(`users/${this.getUid()}/units/${unitIndex}/content/`);
    let removingUnitRowList = [];

    removingUnitRowRef.on('value', (snap) => { removingUnitRowList = snap.val(); });

    removingUnitRowList.splice(rowIndex, 1);
    return removingUnitRowRef.set(removingUnitRowList);
  }

  insertUnitById() {
    const insertUnitRef = this.database.ref(`users/${this.getUid()}/units`);
    let unitList = [];

    insertUnitRef.on('value', (snap) => { unitList = snap.val(); });

    unitList.push({ title: '', content: [['', '0', '0']] });
    return insertUnitRef.set(unitList);
  }

  insertUnitRowById(rowIndex, unitIndex) {
    const insertingRowRef = this.database.ref(`users/${this.getUid()}/units/${unitIndex}/content`);
    let insertingRowList = [];

    insertingRowRef.on('value', (snap) => { insertingRowList = snap.val(); });

    insertingRowList.splice(rowIndex + 1, 0, ['', '0', '0']);
    return insertingRowRef.set(insertingRowList);
  }

  deleteUnitById(unitIndex) {
    const removingUnitRef = this.database.ref(`users/${this.getUid()}/units`);
    let removingUnitList = [];

    removingUnitRef.on('value', (snap) => { removingUnitList = snap.val(); });

    removingUnitList.splice(unitIndex, 1);
    return removingUnitRef.set(removingUnitList);
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
        title: '',
        content: [
          ['', '0', '0'],
        ],
      }],
    });

    return profile;
  }
}
