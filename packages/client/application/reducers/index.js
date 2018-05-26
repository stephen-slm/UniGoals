import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import version from './version';
import notifications from './notifications';
import profile from './profile';
import years from './years';
import displayHelp from './displayHelp';

// setup the master reducer
const rootReducer = combineReducers({
  displayHelp,
  version,
  notifications,
  profile,
  years,
  routing: routerReducer,
});

export default rootReducer;
