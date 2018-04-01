import * as actionTypes from './actionTypes';

/**
 * Updates the users profile on redux
 * @param {object} profile the users profile
 */
export function updateProfile(profile) {
  return {
    type: actionTypes.UPDATE_PROFILE,
    profile,
  };
}

/**
 * Removes the profile completely from the redux store
 */
export function removeProfile() {
  return {
    type: actionTypes.REMOVE_PROFILE,
  };
}

/**
 *  updates the course name for the the user
 * @param {string} courseName The name of the course the user is on
 */
export function updateCourseName(courseName) {
  return {
    type: actionTypes.UPDATE_COURSE_NAME,
    courseName,
  };
}

/**
 * Updates the notifications that will be displayed for the user
 * @param {object} notifications all notifications to be rendered
 */
export function updateNotifications(notifications) {
  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    notifications,
  };
}

/**
 * Removes a selected notification by object key index from the store
 * @param {string} notificationKey The key for the object index of the notification
 */
export function removeNotification(notificationKey) {
  return {
    type: actionTypes.REMOVE_NOTIFICATION,
    notificationKey,
  };
}

/**
 * Adds the users units to the store
 * @param {object} units users units
 */
export function updateUnits(units) {
  return {
    type: actionTypes.UPDATE_UNITS,
    units,
  };
}

/**
 * Updates all the current users year unit content
 * @param {object} years all the users unit data
 */
export function updateYears(years) {
  return {
    type: actionTypes.UPDATE_YEARS,
    years,
  };
}

/**
 * Removes a unit by the uit key
 * @param {string} unitId unit key
 */
export function removeUnit(unitId) {
  return {
    type: actionTypes.REMOVE_UNIT,
    unitId,
  };
}

/**
 * Removes a selected row from a unit table
 * @param {string} rowId the row key
 * @param {string} tableIndex the table index, which unit to remove from
 */
export function removeUnitRow(yearIndex, rowId, tableIndex) {
  return {
    type: actionTypes.REMOVE_UNIT_ROW,
    rowId,
    tableIndex,
    yearIndex,
  };
}

/**
 * removing a year by its index
 * @param {string} yearIndex string index to be removes
 */
export function removeYear(yearIndex) {
  return {
    type: actionTypes.REMOVE_YEAR,
    yearIndex,
  };
}

/**
 * inserts a row in the tableindex unit at the bottom
 * @param {string} rowKeyId row index
 * @param {string} tableIndex unit index
 */
export function insertUnitRow(rowKeyId, yearIndex, tableIndex) {
  return {
    type: actionTypes.INSERT_UNIT_ROW,
    rowKeyId,
    tableIndex,
    yearIndex,
  };
}

/**
 * updates the title of a unit
 * @param {string} title unit title change
 * @param {string} tableIndex unit table
 */
export function updateUnitTitle(title, yearIndex, tableIndex) {
  return {
    type: actionTypes.UPDATE_UNIT_TITLE,
    title,
    tableIndex,
    yearIndex,
  };
}

/**
 * adds a new unit at the bottom based on the key
 * @param {string} key firebase unit key
 */
export function addUnitTable(yearIndex, key) {
  return {
    type: actionTypes.ADD_UNIT_TABLE,
    yearIndex,
    key,
  };
}

/**
 * Removes the whole unit table based on the firebase key
 * @param {string} unitTableIndex unit key
 */
export function removeUnitTable(yearIndex, unitTableIndex) {
  return {
    type: actionTypes.REMOVE_UNIT_TABLE,
    unitTableIndex,
    yearIndex,
  };
}

export function updateYearTitle(yearIndex, yearTitle) {
  return {
    type: actionTypes.UPDATE_YEAR_TITLE,
    yearIndex,
    yearTitle,
  };
}

/**
 * Updates a column with the change, columns are either name, achieved or weighting
 * @param {string} change change to make in the column
 * @param {string} tableIndex the unit key
 * @param {string} rowIndex the row key to update
 * @param {string} columnIndex the column name to update (name, achieved, weighting)
 */
export function updateRowContent(change, yearIndex, tableIndex, rowIndex, columnIndex) {
  return {
    type: actionTypes.UPDATE_UNIT_ROW_CONTENT,
    yearIndex,
    change,
    tableIndex,
    rowIndex,
    columnIndex,
  };
}

export function insertNewYear(yearKey, title, unitKey) {
  return {
    type: actionTypes.INSERT_YEAR,
    yearKey,
    title,
    unitKey,
  };
}

export function showHelpBox() {
  return {
    type: actionTypes.SHOW_HELP_BOX,
  };
}
