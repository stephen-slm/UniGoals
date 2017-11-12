import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication';
import notifications from './notifications';
import profile from './profile';
import client from './client';
import units from './units';

// setup the master reducer
const rootReducer = combineReducers({
  authentication,
  notifications,
  client,
  profile,
  units,
  routing: routerReducer,
});

export default rootReducer;
