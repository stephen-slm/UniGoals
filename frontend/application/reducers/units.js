import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function units(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_UNITS: {
      const newUnits = action.units;

      if (!_.isNil(newUnits) && !_.isNil(newUnits[0])) {
        return newUnits;
      }

      return action.state;
    }
    case actionTypes.REMOVE_UNIT_ROW: {
      const { rowId: removingRowId, unitTitle } = action;

      if (_.isNil(removingRowId) || !_.isInteger(removingRowId)) {
        return state;
      } else if (_.isNil(unitTitle) || !_.isString(unitTitle)) {
        return state;
      }

      const adjustedUnitRow = state.slice();
      let spliceIndex = null;

      _.forEach(adjustedUnitRow, (unit, index) => {
        if (unit.title === unitTitle) {
          spliceIndex = index;
        }
      });

      if (!_.isNil(spliceIndex)) {

        adjustedUnitRow[spliceIndex].content.splice(removingRowId, 1);
        return adjustedUnitRow;
      }

      return state;
    }

    case actionTypes.INSERT_UNIT_ROW: {
      const { unitTitle: insertingUnitTitle } = action;
      let { rowId: insertingRowId } = action;

      insertingRowId += 1;

      if (_.isNil(insertingRowId) || !_.isInteger(insertingRowId)) {
        return state;
      } else if (_.isNil(insertingUnitTitle) || !_.isString(insertingUnitTitle)) {
        return state;
      }

      const insertingUnitRow = state.slice();
      let insertingIndex = null;

      _.forEach(insertingUnitRow, (unit, index) => {
        if (unit.title === insertingUnitTitle) {
          insertingIndex = index;
        }
      });

      if (!_.isNil(insertingIndex)) {
        if (insertingRowId >= insertingUnitRow[insertingIndex].length) {
          insertingRowId = 0;
        }

        insertingUnitRow[insertingIndex].content.splice(insertingRowId, 0, { name: '', weighting: '', achieved: '' });
        return insertingUnitRow;
      }

      return state;
    }

    default: {
      return state;
    }
  }
}
