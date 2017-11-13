import * as actionTypes from './actionTypes';


// Authentication
export function authenticating(authentication) {
  return {
    type: actionTypes.UPDATE_AUTHENTICATED,
    authentication,
  };
}

// Contact types
export function updateContactInformation(contact = {}) {
  return {
    type: actionTypes.UPDATE_CONTACT_INFORMATION,
    contact,
  };
}

export function removeContactInformation(contact = {}) {
  return {
    type: actionTypes.REMOVE_CONTACT_INFORMATION,
    contact,
  };
}

// Profile
export function updateProfile(profile) {
  return {
    type: actionTypes.UPDATE_PROFILE,
    profile,
  };
}

// Profile
export function removeProfile() {
  return {
    type: actionTypes.REMOVE_PROFILE,
  };
}

// Notifications
export function updateNotifications(notifications) {
  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    notifications,
  };
}

// Units
export function updateUnits(units) {
  return {
    type: actionTypes.UPDATE_UNITS,
    units,
  };
}

export function removeUnit(unitId) {
  return {
    type: actionTypes.REMOVE_UNIT,
    unitId,
  };
}

export function removeUnitRow(rowId, tableIndex) {
  return {
    type: actionTypes.REMOVE_UNIT_ROW,
    rowId,
    tableIndex,
  };
}

export function insertUnitRow(rowId, tableIndex) {
  return {
    type: actionTypes.INSERT_UNIT_ROW,
    rowId,
    tableIndex,
  };
}

export function updateUnitTitle(title, tableIndex) {
  return {
    type: actionTypes.UPDATE_UNIT_TITLE,
    title,
    tableIndex,
  };
}

export function updateRowContent(change, tableIndex, rowIndex, columnIndex) {
  return {
    type: actionTypes.UPDATE_UNIT_ROW_CONTENT,
    change,
    tableIndex,
    rowIndex,
    columnIndex,
  };
}

