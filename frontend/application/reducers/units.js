import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function units(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_UNITS: {
      if (!_.isNil(action.units)) {
        return action.units;
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
      const { unitTableIndex: removingUnitTableIndex } = action;

      if (_.isNil(removingUnitTableIndex) || !_.isString(removingUnitTableIndex)) {
        return state;
      }

      const adjustedUnitRow = Object.assign({}, state);

      delete adjustedUnitRow[removingUnitTableIndex];
      return adjustedUnitRow;
    }

    /**
     * When a user clicks on the insert + sign, creating a new row at the bottom of the page.
     * This will first contact the firebase and get the key to be used in the system, syncing
     * up with firebase.
     */
    case actionTypes.INSERT_UNIT_ROW: {
      const { tableIndex: insertingTableIndex, rowKeyId: insertingRowId } = action;

      if (_.isNil(insertingRowId) || !_.isString(insertingRowId)) {
        return state;
      } else if (_.isNil(insertingTableIndex) || !_.isString(insertingTableIndex)) {
        return state;
      }

      const insertingUnitRow = Object.assign({}, state);

      if (_.isNil(insertingUnitRow[insertingTableIndex].content)) {
        insertingUnitRow[insertingTableIndex].content = {};
      }

      insertingUnitRow[insertingTableIndex].content[insertingRowId] = { name: '', weighting: '0', achieved: '0' };
      return insertingUnitRow;
    }

    case actionTypes.UPDATE_UNIT_ROW_CONTENT: {
      const {
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
      }

      const updateUnitContent = Object.assign({}, state);

      updateUnitContent[updateUnitTableIndex]
        .content[updateUnitRowIndex][updateUnitColumnIndex] = updateUnitChange;
      return updateUnitContent;
    }

    /**
     * Update the unit row title, this does not take in a ref number as it does not matter when
     * contacting the firebase we just update the title.
     */
    case actionTypes.UPDATE_UNIT_TITLE: {
      const { title: updateUnitTitle, tableIndex: updateTableIndex } = action;

      if (_.isNil(updateTableIndex) || !_.isString(updateTableIndex)) {
        return state;
      } else if (_.isNil(updateUnitTitle) ||
        !_.isString(updateUnitTitle) || updateUnitTitle.length > 30) {
        return state;
      }

      const updateUnitTitleContent = Object.assign({}, state);
      updateUnitTitleContent[updateTableIndex].title = updateUnitTitle;

      return updateUnitTitleContent;
    }

    /**
     * This will first contact the firebase database to create the table, using the reference
     * from this request to create the table here.
     */
    case actionTypes.ADD_UNIT_TABLE: {
      const unitTableAdd = Object.assign({}, state);
      unitTableAdd[action.key] = { title: '', content: {} };
      return unitTableAdd;
    }

    default: {
      return state;
    }
  }
}
