import React from 'react';
import PropTypes from 'prop-types';

export default class SignOut extends React.Component {
  constructor(props) {
    super(props);
    /**
     * When this route is called, the user will be logged out of firebase (google), logging them
     * out of the application, then the profile of the user will be removed to stop caching
     * issue when they login. Finally the route address will be reset and the page reloaded.
     */
    this.props.firebase.authentication.signOut();
    this.props.removeProfile();
    this.props.history.push('/');
    window.location.reload();
  }

  render() {
    return <div>Sign out</div>;
  }
}

SignOut.propTypes = {
  history: PropTypes.shape().isRequired,
  firebase: PropTypes.shape().isRequired,
  removeProfile: PropTypes.func.isRequired,
};
