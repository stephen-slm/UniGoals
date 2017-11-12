import endpoint from '../endpoint';
import utils from '../utils';

const helpEndpoint = endpoint({
  apiUrl: utils.API_URL,
  path: 'help/send',
  send(name, email, text) {
    const options = utils.buildOptions(this.apiUrl, this.path, 'post', {
      name, email, text,
    });
    return this.apiCall(options);
  },
});

export default helpEndpoint;
