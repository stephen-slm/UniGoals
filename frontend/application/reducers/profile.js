import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function profile(state = { email: null, isNew: true }, action) {
  switch (action.type) {
    case actionTypes.UPDATE_PROFILE: {
      if (!_.isNil(action.profile) && !_.isNil(action.profile.token)) {
        return Object.assign({ isNew: true }, action.profile);
      }
      return action.state;
    }
    case actionTypes.REMOVE_PROFILE: {
      return {
        givenName: null,
        familyName: null,
      };
    }
    default: {
      return state;
    }
  }
}
