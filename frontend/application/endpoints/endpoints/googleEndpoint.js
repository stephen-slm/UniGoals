import endpoint from '../endpoint';
import utils from '../utils';

const volunteerEndpoint = endpoint({
  apiUrl: utils.API_URL,
  path: 'google',
  authenticate(profile) {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/authenticate`, 'post', { profile });
    return this.apiCall(options);
  },
});

export default volunteerEndpoint;
