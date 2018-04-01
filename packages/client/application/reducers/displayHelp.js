import * as actionTypes from '../actions/actionTypes';

export default function displayHelp(state = false, action) {
  switch (action.type) {
    case actionTypes.SHOW_HELP_BOX: {
      return !state;
    }
    default: {
      return state;
    }
  }
}
