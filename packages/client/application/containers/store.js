/* eslint-disable no-underscore-dangle */
import { createStore } from 'redux';

import rootReducer from '../reducers/index';
import { version } from '../../package.json';

const defaultState = {
  version,
};

const store = createStore(
  rootReducer,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
