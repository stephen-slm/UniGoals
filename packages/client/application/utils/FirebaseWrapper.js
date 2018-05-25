import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as constants from '../utils/constants';
import { getHappyEmoji } from './utils';

export default class FirebaseWrapper {
  constructor(config) {
    this.configuration = config;

    firebase.initializeApp(this.configuration);

    this.database = firebase.database();
    /**
     * Ensuring that all future authentication request and persisted in the current state and
     * continuing to use this state for the following refreshes on the webite, meaning that
     * unless the user clicks that they want to sign out, they will always be logged back
     * into the site automatically from that same device.
     */
    this.authentication = firebase.auth();
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  /**
   * authenticates the user based on mobile or standard
   * @param {string} type authentication type
   */
  authenticate(type) {
    switch (type) {
      case 'mobile':
        return this.authentication.signInWithRedirect(this.provider);
      default:
        return this.authentication.signInWithPopup(this.provider);
    }
  }

  /**
   * Gets the current active users uid which is used to reference in the database
   * @returns {string}
   */
  getUid() {
    return !_.isNil(this.authentication.currentUser) ? this.authentication.currentUser.uid : null;
  }

  /**
   * returns the current example users information from the firebase database
   * @returns {firebase.Promise.<void>}
   */
  getExampleUser() {
    return this.database
      .ref('users/example')
      .once('value')
      .then((user) => Promise.resolve(user.val()))
      .catch((error) => Promise.reject(error));
  }

  /**
   * returns all active notifications (active means actually existing) for that user
   * @returns {firebase.Promise.<void>}
   */
  getUserNotifications() {
    return this.database.ref(`users/${this.getUid()}/notifications`).once('value');
  }

  /**
   * removes a certain notificaitoon from the firebase database
   * @param key The key string for the index of the notification
   * @returns {firebase.Promise.<void>}
   */
  dismissNotification(key) {
    return this.database.ref(`users/${this.getUid()}/notifications/${key}`).remove();
  }

  /**
   * sets a welcome notification for new users being created on the system
   * @returns {Promise.<void>}
   */
  insertWelcomeNotification() {
    const insertingWelcomeNotification = this.database.ref(`users/${this.getUid()}/notifications`);

    const insertingNotificationKey = insertingWelcomeNotification.push({
      title: `Welcome ${this.authentication.currentUser.displayName}!`,
      message: 'Welcome to UniGoals! Any problems click the help button next to me!',
      timestamp: Date.now(),
    });
    return Promise.resolve(insertingNotificationKey.key);
  }

  addUniversityDetails(courseName, courseYear, courseUniversity) {
    this.database.ref(`users/${this.getUid()}/profile/course_name`).set(courseName);
    this.database.ref(`users/${this.getUid()}/profile/course_year`).set(courseYear);
    this.database.ref(`users/${this.getUid()}/profile/course_university`).set(courseUniversity);
    return Promise.resolve();
  }

  // returns all the users content
  getUserContent() {
    return this.database
      .ref(`users/${this.getUid()}`)
      .once('value')
      .then((user) => Promise.resolve(user.val()))
      .catch((error) => Promise.reject(error));
  }

  /**
   * Gets all the active units for the active google user
   * @returns {firebase.Promise.<*>}
   */
  getUnitsById() {
    return this.database.ref(`users/${this.getUid()}/units`).once('value');
  }

  /**
   * Gets all the content for all the users years.
   */
  getAllYearUnits() {
    return this.database.ref(`users/${this.getUid()}/years`).once('value');
  }

  /**
   * Gets the active users profile
   * @returns {firebase.Promise.<*>}
   */
  getProfileById() {
    return this.database.ref(`users/${this.getUid()}/profile`).once('value');
  }

  /**
   * Update user login count and set new date
   */
  updateLoginCountAndDate() {
    this.database.ref(`users/${this.getUid()}/profile/last_login`).set(Date.now());

    return this.database
      .ref(`users/${this.getUid()}/profile/login_count`)
      .once('value')
      .then((snapshot) => {
        const count = snapshot.val();
        const newLoginCount = count === null || count === undefined ? 0 : count + 1;
        return this.database.ref(`users/${this.getUid()}/profile/login_count`).set(newLoginCount);
      });
  }

  /**
   * Update a year title
   * @param {string} yearIndex selected year
   * @param {string} title the new title
   */
  updateYearTitle(yearIndex, title) {
    this.database.ref(`users/${this.getUid()}/years/${yearIndex}`).update({ title });
  }

  /**
   * updates a units title in the firebase for the active user based on the unit key, validation
   * is done client and on the firebase database
   * @param change The change (string) happening on the server
   * @param key The key of the unit updating it.
   * @returns {firebase.Promise.<void>}
   */
  updateUnitTitle(change, yearKey, unitKey) {
    return this.database.ref(`users/${this.getUid()}/years/${yearKey}/units/${unitKey}/title`).set(change);
  }

  /**
   * Updates the courseName for the user on the profile
   * @param change The change to for the users profile
   * @returns {firebase.Promise.<void>}
   */
  updateProfileCourse(change) {
    return this.database.ref(`users/${this.getUid()}/profile/course_name`).set(change);
  }

  /**
   * replaces the entire profile
   * @param profile the profile that is being updated
   */
  updateProfile(profile) {
    return this.database.ref(`users/${this.getUid()}/profile`).set(profile);
  }

  /**
   * update the content on a row for a unit, must contain the change, tablekey, rowKey and then
   * the column index which would be either (name, archieved or weighting)
   * @param change What is being changed
   * @param tableIndex The unit key
   * @param rowIndex the row key
   * @param columnIndex the type (name, archieved or weighting)
   * @returns {firebase.Promise.<void>}
   */
  updateUnitRowSection(change, yearIndex, tableIndex, rowIndex, columnIndex) {
    return this.database
      .ref(`users/${this.getUid()}/years/${yearIndex}/units/${tableIndex}/content/${rowIndex}/${columnIndex}`)
      .set(change);
  }

  /**
   * deletes a unit row by unit and table index
   * @param unitRowKey the unit which row is being deleted
   * @param tableUnitKey the row key which is being deleted
   * @returns {firebase.Promise.<void>}
   */
  deleteUnitRowById(yearIndex, unitRowKey, tableUnitKey) {
    return this.database.ref(`users/${this.getUid()}/years/${yearIndex}/units/${tableUnitKey}/content/${unitRowKey}`).remove();
  }

  /**
   * inserts a new unit at the bottom of the units list
   * @returns {firebase.Promise.<*>}
   */
  insertUnitById(yearIndex) {
    return this.database
      .ref(`users/${this.getUid()}/years/${yearIndex}/units`)
      .once('value')
      .then((currentUnitState) => {
        if (currentUnitState.numChildren() >= constants.UNIT.MAX) {
          return Promise.reject(new Error(`Only a maximum of ${constants.UNIT.MAX} units at anyone time.`));
        }

        const insertUnitRef = this.database.ref(`users/${this.getUid()}/years/${yearIndex}/units`);
        const insertKey = insertUnitRef.push({
          title: 'New Unit',
          double: false,
          content: {},
        });
        return Promise.resolve(insertKey.key);
      });
  }

  /**
   * sets the unit as a double weighted unit
   * @param {string} yearKey the key of the year
   * @param {string} unitKey they key of the unit
   * @returns {firebase.Promise.<*>}
   */
  setUnitAsDoubleWeight(yearKey, unitKey) {
    return this.setUnitDoubleWeightStatus(yearKey, unitKey, true);
  }

  /**
   * sets the unit as not a double weighted unit
   * @param {string} yearKey the key the year
   * @param {string} unitKey the key of the unit
   * @returns {firebase.Promise.<*>}
   */
  setUnitAsNotDoubleWeight(yearKey, unitKey) {
    return this.setUnitAsDoubleWeight(yearKey, unitKey, false);
  }

  /**
   * updates the double weighted unit value of the unit to the value
   * @param {string} yearKey the year key
   * @param {string} unitKey the unit key
   * @param {boolean} value the boolean value
   * @returns {firebase.Promise.<*>}
   */
  setUnitDoubleWeightStatus(yearIndex, tableIndex, value) {
    return this.database.ref(`users/${this.getUid()}/years/${yearIndex}/units/${tableIndex}/double`).set(value);
  }

  /**
   * updates the dropped unit value of the unit to the value
   * @param {string} yearKey the year key
   * @param {string} unitKey the unit key
   * @param {boolean} value the boolean value
   * @returns {firebase.Promise.<*>}
   */
  setUnitDroppedStatus(yearIndex, tableIndex, value) {
    return this.database.ref(`users/${this.getUid()}/years/${yearIndex}/units/${tableIndex}/dropped`).set(value);
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
   * inserts a new row at the bottom of the unit
   * @param unitKey The unit key to insert into
   * @returns {firebase.Promise.<*>}
   */
  insertUnitRowById(yearKey, unitKey) {
    return this.database
      .ref(`users/${this.getUid()}/years/${yearKey}/units/${unitKey}/content`)
      .once('value')
      .then((currentRowState) => {
        if (currentRowState.numChildren() >= constants.UNIT.ENTRY_MAX) {
          return Promise.reject(new Error(`Only a maximum of ${constants.UNIT.ENTRY_MAX} rows at anyone time per unit.`));
        }

        const insertingUnitRowRef = this.database.ref(`users/${this.getUid()}/years/${yearKey}/units/${unitKey}/content`);

        const insertingUnitRowKey = insertingUnitRowRef.push({
          name: 'Section',
          weighting: '0',
          achieved: '0',
        });

        return Promise.resolve(insertingUnitRowKey.key);
      });
  }

  /**
   * deletes a complete unit based on the unit key given (warning message given before hand)
   * @param unitIndex The unit index key used for this process
   * @returns {firebase.Promise.<void>}
   */
  deleteUnitById(yearIndex, unitIndex) {
    return this.database.ref(`users/${this.getUid()}/years/${yearIndex}/units/${unitIndex}`).remove();
  }

  /**
   * inserts into the help section with a message, name and email
   * @param message The message being stored
   * @param name The name of the user inserting it
   * @param email The email address of the person inserting.
   * @returns {Promise.<boolean>}
   */
  sendHelpMessage(message, name, email) {
    return this.database
      .ref('help')
      .push({
        message,
        name,
        email,
        timestamp: Date.now(),
      })
      .then(() => Promise.resolve(true))
      .catch((error) => Promise.reject(error));
  }

  /**
   * deletes a complete year
   * @param {string} yearIndex the year index for deleting
   */
  deleteYear(yearIndex) {
    const yearsRef = this.database.ref(`users/${this.getUid()}/years`);

    return yearsRef.once('value').then((years) => {
      if (_.size(years.val()) === constants.YEAR.MIN) {
        return Promise.reject(new Error(`You cannot have less than ${constants.YEAR.MIN} years`));
      }

      if (!_.isNil(yearIndex)) {
        this.database.ref(`users/${this.getUid()}/years/${yearIndex}`).remove();
        return Promise.resolve();
      }

      return Promise.reject(new Error('Selected year cannot be removed'));
    });
  }

  createNewYear(name) {
    const newYearRef = this.database.ref(`users/${this.getUid()}/years`).push({ units: {}, title: `${_.isNil(name) ? 'Year 1' : name}` });
    return newYearRef;
  }

  insertNewYear() {
    const yearsRef = this.database.ref(`users/${this.getUid()}/years`);
    let title;

    return yearsRef
      .once('value')
      .then((yearsData) => {
        const years = yearsData.val();
        const yearLen = Object.keys(years).length + 1;
        title = `Year ${yearLen} ${getHappyEmoji()}`;
        if (_.size(years) >= constants.YEAR.MAX) {
          return Promise.reject(new Error(`Only a maximum of ${constants.YEAR.MAX} years at anyone time.`));
        }
        return this.createNewYear(title);
      })
      .then((newYearRef) => {
        const sampleOneRef = this.database.ref(`users/${this.getUid()}/years/${newYearRef.key}/units`);
        const sampleKey = sampleOneRef.push({ title: 'New Unit', content: {} });
        return { yearKey: newYearRef.key, title, unitKey: sampleKey.key };
      });
  }

  /**
   * when a user is created, sample units are created, this is by using the above function
   * for inserting a unit and updating rows.
   */
  createSampleUnitsForNewUser() {
    const firstYear = this.createNewYear();

    const sampleOneRef = this.database.ref(`users/${this.getUid()}/years/${firstYear.key}/units`);
    const sampleOneKey = sampleOneRef.push({
      title: 'Example Unit',
      content: {},
    });

    this.insertUnitRowById(firstYear.key, sampleOneKey.key).then((unitRow) => {
      this.updateUnitRowSection('Coursework', firstYear.key, sampleOneKey.key, unitRow, 'name');
      this.updateUnitRowSection('50', firstYear.key, sampleOneKey.key, unitRow, 'weighting');
      this.updateUnitRowSection('71', firstYear.key, sampleOneKey.key, unitRow, 'achieved');
    });

    this.insertUnitRowById(firstYear.key, sampleOneKey.key).then((unitRow) => {
      this.updateUnitRowSection('Exam', firstYear.key, sampleOneKey.key, unitRow, 'name');
      this.updateUnitRowSection('50', firstYear.key, sampleOneKey.key, unitRow, 'weighting');
      this.updateUnitRowSection('31', firstYear.key, sampleOneKey.key, unitRow, 'achieved');
    });

    Promise.resolve();
  }

  /**
   * Gets the University Courses for the user
   */
  getUniversityCourses() {
    return this.database
      .ref('/universities/courses')
      .once('value')
      .then((courses) => Promise.resolve(courses.val()));
  }

  /**
   * Gets the current active University listings (all of the list in a array format)
   */
  getUniversityList() {
    return this.database
      .ref('/universities/uk')
      .once('value')
      .then((list) => Promise.resolve(list.val()));
  }

  /**
   * Returns all the University content stored in the database
   */
  getUniversityContents() {
    return this.database
      .ref('/universities')
      .once('value')
      .then((content) => Promise.resolve(content.val()));
  }

  // Gets a built ref for the live listeners for updated notifications
  getNotificationRef() {
    return this.database.ref(`users/${this.getUid()}/notifications`);
  }

  /**
   * Builds the profile up that would be used to create users while also can be used for displaying
   * data if its not required from the server when making the first gather of information.
   * @param {loginObject} login the login object that is returned when authenticating with google
   */
  generateProfileFromLogin() {
    const { currentUser } = this.authentication;
    const profileSelectionList = constants.PROFILE_SELECTION;
    const profile = _.pick(currentUser, profileSelectionList);

    return Object.assign(profile, {
      hd: profile.email.split('@')[1],
    });
  }

  /**
   * creates a new user for which is called when a new sign in user happens
   * @returns {firebase.Promise.<*>}
   */
  createNewUser() {
    const profile = this.generateProfileFromLogin();

    return this.database
      .ref(`users/${this.getUid()}/profile`)
      .set({
        given_name: profile.displayName.split(' ')[0],
        family_name: profile.displayName.split(' ')[1],
        email: profile.email,
        picture: profile.photoURL,
        name: profile.displayName,
        hd: profile.hd,
        last_login: Date.now(),
      })
      .then(() => this.createSampleUnitsForNewUser())
      .then(() => this.insertWelcomeNotification())
      .then(() => Promise.resolve(profile));
  }
}
