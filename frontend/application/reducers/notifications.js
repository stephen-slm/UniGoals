import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes';

export default function notifications(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_NOTIFICATIONS: {
      const newNotifications = action.notifications;

      if (_.isObject(newNotifications) && !_.isNil(newNotifications)) {
        return newNotifications;
      }

      return state;
    }
    default: {
      return state;
    }
  }
}
