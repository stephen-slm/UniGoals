import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function units(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_UNITS: {
      const newUnits = action.units;

      if (!_.isNil(newUnits) && !_.isNil(newUnits[0])) {
        return newUnits;
      }

      return state;
    }
    case actionTypes.REMOVE_UNIT_ROW: {
      const { rowId: removingRowId, tableIndex: removingTableIndex } = action;

      if (_.isNil(removingRowId) || !_.isInteger(removingRowId)) {
        return state;
      } else if (_.isNil(removingTableIndex) || !_.isInteger(removingTableIndex)) {
        return state;
      }

      const adjustedUnitRow = state.slice();

      adjustedUnitRow[removingTableIndex].content.splice(removingRowId, 1);
      return adjustedUnitRow;
    }

    case actionTypes.INSERT_UNIT_ROW: {
      const { tableIndex: insertingTableIndex, rowId: insertingRowId } = action;

      if (_.isNil(insertingRowId) || !_.isInteger(insertingRowId)) {
        return state;
      } else if (_.isNil(insertingTableIndex) || !_.isInteger(insertingTableIndex)) {
        return state;
      }

      const insertingUnitRow = state.slice();
      insertingUnitRow[insertingTableIndex].content.splice(insertingRowId + 1, 0, [null, '0', '0']);

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
      } else if (_.isNil(updateUnitTableIndex) || !_.isInteger(updateUnitTableIndex)) {
        return state;
      } else if (_.isNil(updateUnitRowIndex) || !_.isInteger(updateUnitRowIndex)) {
        return state;
      } else if (_.isNil(updateUnitColumnIndex) || !_.isInteger(updateUnitColumnIndex)) {
        return state;
      }

      const updateUnitContent = state.slice();
      updateUnitContent[updateUnitTableIndex].content[updateUnitRowIndex][updateUnitColumnIndex] = updateUnitChange;
      return updateUnitContent;
    }

    case actionTypes.UPDATE_UNIT_TITLE: {
      const { title: updateUnitTitle, tableIndex: updateTableIndex } = action;

      if (_.isNil(updateTableIndex) || !_.isInteger(updateTableIndex)) {
        return state;
      } else if (_.isNil(updateUnitTitle) || !_.isString(updateUnitTitle) || updateUnitTitle.length > 30) {
        return state;
      }

      const updateUnitTitleContent = state.slice();
      updateUnitTitleContent[updateTableIndex].title = updateUnitTitle;

      return updateUnitTitleContent;
    }

    case actionTypes.ADD_UNIT_TABLE: {
      const addUnitTableContent = state.slice();
      addUnitTableContent[addUnitTableContent.length] = { new: true, title: null, content: [[null, '0', '0']] };
      return addUnitTableContent;
    }

    case actionTypes.REMOVE_UNIT_TABLE: {
      const removingTableIndex = action.unitTableIndex;

      if (_.isNil(removingTableIndex) || !_.isInteger(removingTableIndex)) {
        return state;
      }

      const removingTableContent = state.slice();
      removingTableContent.splice(removingTableIndex, 1);
      return removingTableContent;
    }

    default: {
      return state;
    }
  }
}
