import { createStore } from 'redux';

import rootReducer from '../reducers/index';
import { version } from '../../package.json';

const defaultState = {
  version,
};

const store = createStore(rootReducer, defaultState);

export default store;
