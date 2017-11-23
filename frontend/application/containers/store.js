import { createStore } from 'redux';

import rootReducer from '../reducers/index';

const authentication = { username: null, result: false };

const defaultState = {
  authentication,
};

const store = createStore(rootReducer, defaultState);

export default store;
