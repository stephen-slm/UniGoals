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
    case actionTypes.REMOVE_UNIT: {
      // This should remove a single unit, by unit index
      return state;
    }
    default: {
      return state;
    }
  }
}
