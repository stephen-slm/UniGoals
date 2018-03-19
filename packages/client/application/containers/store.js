/* eslint-disable no-underscore-dangle */
import { createStore } from 'redux';

import FirebaseWrapper from '../utils/FirebaseWrapper';
import rootReducer from '../reducers/index';
import { version } from '../../package.json';

const firebase = new FirebaseWrapper({
  apiKey: 'AIzaSyDBSpRMIl4olTWN0AOMCTMVqeIVkhGio_8',
  authDomain: 'organic-lacing-185810.firebaseapp.com',
  databaseURL: 'https://organic-lacing-185810.firebaseio.com',
  projectId: 'organic-lacing-185810',
  storageBucket: 'organic-lacing-185810.appspot.com',
  messagingSenderId: '40609903553',
});

const defaultState = {
  version,
  firebase,
};

const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
