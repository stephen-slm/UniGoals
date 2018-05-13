import * as _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function profile(
  state = {
    email: null,
    new: true,
    name: '',
    auth: false,
  },
  action,
) {
  switch (action.type) {
    case actionTypes.UPDATE_PROFILE: {
      if (!_.isNil(action.profile) && !_.isNil(action.profile.name)) {
        return Object.assign({}, action.profile);
      }
      return state;
    }
    case actionTypes.REMOVE_PROFILE: {
      return {
        givenName: null,
        familyName: null,
      };
    }
    case actionTypes.UPDATE_COURSE_NAME: {
      const { courseName } = action;

      if (!_.isNil(courseName) && _.isString(courseName) && courseName.length) {
        const courseNameUpdate = Object.assign({}, state);
        courseNameUpdate.courseName = courseName;
        return courseNameUpdate;
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
