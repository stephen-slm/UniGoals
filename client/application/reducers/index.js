import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import version from './version';
import notifications from './notifications';
import profile from './profile';
import years from './years';

// setup the master reducer
const rootReducer = combineReducers({
  version,
  notifications,
  profile,
  years,
  routing: routerReducer,
});

export default rootReducer;
