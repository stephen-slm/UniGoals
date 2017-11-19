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
    return this.database.ref(`users/${this.getUid()}/profile`).once('value')
      .then(ref => ref.val());
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
    const insertingUnitRowKey = insertingUnitRowRef.push({ name: 'Section', weighting: '0', archived: '0' });
    return Promise.resolve(insertingUnitRowKey.key);
  }

  deleteUnitById(unitIndex) {
    return this.database.ref(`users/${this.getUid()}/units/${unitIndex}`).remove();
  }

  sendHelpMessage(message, name, email) {
    const insertingHelpMessage = this.database.ref('help');
    insertingHelpMessage.push({
      message,
      name,
      email,
      timestamp: Date.now(),
    });
    return Promise.resolve(true);
  }

  createSampleUnitsForNewUser() {
    const sampleOneRef = this.database.ref(`users/${this.getUid()}/units`);
    const sampleOneKey = sampleOneRef.push({ title: 'Sample', content: {} });

    this.insertUnitRowById(sampleOneKey.key)
      .then((unitRow) => {
        this.updateUnitRowSection('Coursework', sampleOneKey.key, unitRow, 'name')
          .then(() => this.updateUnitRowSection('50', sampleOneKey.key, unitRow, 'weighting'))
          .then(() => this.updateUnitRowSection('71', sampleOneKey.key, unitRow, 'archived'));
      });

    this.insertUnitRowById(sampleOneKey.key)
      .then((unitRow) => {
        this.updateUnitRowSection('Exam', sampleOneKey.key, unitRow, 'name')
          .then(() => this.updateUnitRowSection('50', sampleOneKey.key, unitRow, 'weighting'))
          .then(() => this.updateUnitRowSection('31', sampleOneKey.key, unitRow, 'archived'));
      });
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

    return this.database.ref(`users/${uid}/profile`).set({
      uid,
      given_name,
      family_name,
      email,
      picture,
      name,
      hd,
    })
      .then(() => this.createSampleUnitsForNewUser())
      .then(() => Promise.resolve(profile));
  }
}
