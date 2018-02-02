import * as _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function years(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_YEARS: {
      if (!_.isNil(action.years)) {
        return action.years;
      }
      return state;
    }

    /**
     * Removes a single row based on the row key, this is not based on anything from firebase
     * but they will both be removed at the same time. by the key.
     */
    case actionTypes.REMOVE_UNIT_ROW: {
      const { rowId: removingRowId, tableIndex: removeRowTableIndex } = action;

      if (_.isNil(removingRowId) || !_.isString(removingRowId)) {
        return state;
      } else if (_.isNil(removeRowTableIndex) || !_.isString(removeRowTableIndex)) {
        return state;
      }

      const adjustedUnitRow = Object.assign({}, state);

      delete adjustedUnitRow[removeRowTableIndex].content[removingRowId];
      return adjustedUnitRow;
    }

    case actionTypes.REMOVE_UNIT_TABLE: {
      const { yearIndex, unitTableIndex: removingUnitTableIndex } = action;

      if (_.isNil(removingUnitTableIndex) || !_.isString(removingUnitTableIndex)) {
        return state;
      }

      if (_.isNil(yearIndex) || !_.isString(yearIndex)) {
        return state;
      }

      const adjustedUnitRow = Object.assign({}, state);

      delete adjustedUnitRow[yearIndex].units[removingUnitTableIndex];
      return adjustedUnitRow;
    }

    /**
     * When a user clicks on the insert + sign, creating a new row at the bottom of the page.
     * This will first contact the firebase and get the key to be used in the system, syncing
     * up with firebase.
     */
    case actionTypes.INSERT_UNIT_ROW: {
      const { yearIndex, tableIndex: insertingTableIndex, rowKeyId: insertingRowId } = action;

      if (_.isNil(insertingRowId) || !_.isString(insertingRowId)) {
        return state;
      } else if (_.isNil(insertingTableIndex) || !_.isString(insertingTableIndex)) {
        return state;
      } else if (_.isNil(yearIndex) || !_.isString(yearIndex)) {
        return false;
      }

      const insertingUnitRow = Object.assign({}, state);

      if (_.isNil(insertingUnitRow[yearIndex].units[insertingTableIndex].content)) {
        insertingUnitRow[yearIndex].units[insertingTableIndex].content = {};
      }

      insertingUnitRow[yearIndex].units[insertingTableIndex].content[insertingRowId] = { name: '', weighting: '0', achieved: '0' };
      return insertingUnitRow;
    }

    case actionTypes.UPDATE_UNIT_ROW_CONTENT: {
      const {
        yearIndex,
        change: updateUnitChange,
        tableIndex: updateUnitTableIndex,
        rowIndex: updateUnitRowIndex,
        columnIndex: updateUnitColumnIndex,
      } = action;

      if (_.isNil(updateUnitChange) || !_.isString(updateUnitChange)) {
        return state;
      } else if (_.isNil(updateUnitTableIndex) || !_.isString(updateUnitTableIndex)) {
        return state;
      } else if (_.isNil(updateUnitRowIndex) || !_.isString(updateUnitRowIndex)) {
        return state;
      } else if (_.isNil(updateUnitColumnIndex) || !_.isString(updateUnitColumnIndex)) {
        return state;
      } else if (_.isNil(yearIndex) || !_.isString(yearIndex)) {
        return state;
      }

      const updateUnitContent = Object.assign({}, state);

      updateUnitContent[yearIndex].units[updateUnitTableIndex]
        .content[updateUnitRowIndex][updateUnitColumnIndex] = updateUnitChange;
      return updateUnitContent;
    }

    /**
     * Update the unit row title, this does not take in a ref number as it does not matter when
     * contacting the firebase we just update the title.
     */
    case actionTypes.UPDATE_UNIT_TITLE: {
      const { yearIndex, title: updateUnitTitle, tableIndex: updateTableIndex } = action;

      if (_.isNil(updateTableIndex) || !_.isString(updateTableIndex)) {
        return state;
      } else if (_.isNil(updateUnitTitle) ||
        !_.isString(updateUnitTitle) || updateUnitTitle.length > 30) {
        return state;
      }

      if (_.isNil(yearIndex) || !_.isString(yearIndex)) {
        return state;
      }

      const updateUnitTitleContent = Object.assign({}, state);
      updateUnitTitleContent[yearIndex].units[updateTableIndex].title = updateUnitTitle;

      return updateUnitTitleContent;
    }

    /**
     * This will first contact the firebase database to create the table, using the reference
     * from this request to create the table here.
     */
    case actionTypes.ADD_UNIT_TABLE: {
      const unitTableAdd = Object.assign({}, state);
      unitTableAdd[action.yearIndex].units[action.key] = { title: '', content: {} };
      return unitTableAdd;
    }

    case actionTypes.INSERT_YEAR: {
      const newYearKey = action.yearKey;
      const newYearTitle = action.title;
      const newYearUnitKey = action.unitKey;


      if (_.isNil(newYearKey) || !_.isString(newYearKey)) {
        return state;
      } else if (_.isNil(newYearTitle) || !_.isString(newYearTitle)) {
        return state;
      } else if (_.isNil(newYearUnitKey) || !_.isString(newYearUnitKey)) {
        return false;
      }

      const insertNewYears = Object.assign({}, state);

      insertNewYears[newYearKey] = {
        title: newYearTitle,
        units: {},
      };

      insertNewYears[newYearKey].units[newYearUnitKey] = {
        title: 'Example Unit',
        content: {},
      };

      return insertNewYears;
    }

    default: {
      return state;
    }
  }
}
