import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication';
import notifications from './notifications';
import profile from './profile';
import client from './client';

// setup the master reducer
const rootReducer = combineReducers({
  authentication,
  notifications,
  client,
  profile,
  routing: routerReducer,
});

export default rootReducer;
