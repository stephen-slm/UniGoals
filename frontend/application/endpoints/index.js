import * as apiCall from './apiCall';
import utils from './utils';

import helpEndpoint from './endpoints/helpEndpoint';
import googleEndpoint from './endpoints/googleEndpoint';

export default function endpointApi(token = null) {
  const setUtil = (key, value) => {
    utils[key] = value;
  };

  const getUtil = key => utils[key];

  if (token !== null) {
    setUtil('TOKEN', token);
  }

  return {
    apiCall,
    help: helpEndpoint,
    google: googleEndpoint,
    setUtil,
    getUtil,
    utils,
  };
}

