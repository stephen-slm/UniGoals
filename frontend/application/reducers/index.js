import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication';
import notifications from './notifications';
import profile from './profile';
import units from './units';

// setup the master reducer
const rootReducer = combineReducers({
  authentication,
  notifications,
  profile,
  units,
  routing: routerReducer,
});

export default rootReducer;
