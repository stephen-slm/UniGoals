import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import version from './version';
import notifications from './notifications';
import profile from './profile';
import years from './years';
import firebase from './firebase';
import displayHelp from './displayHelp';

// setup the master reducer
const rootReducer = combineReducers({
  displayHelp,
  version,
  notifications,
  profile,
  years,
  firebase,
  routing: routerReducer,
});

export default rootReducer;
