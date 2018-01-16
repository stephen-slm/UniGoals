import * as _ from 'lodash';

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

    case actionTypes.REMOVE_NOTIFICATION: {
      const { notificationKey: keyIndex } = action;

      if (_.isNil(keyIndex) || !_.isString(keyIndex)) {
        return state;
      }

      const removedNotificationContent = Object.assign({}, state);

      delete removedNotificationContent[keyIndex];
      return removedNotificationContent;
    }
    default: {
      return state;
    }
  }
}
