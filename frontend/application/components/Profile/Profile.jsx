import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  validateProfileUpdate() {
    // validate the configuration meets the standard before updating
  }

  render() {
    return (
      <div>
        Profile
      </div>
    );
  }
}

Profile.propTypes = {
};

Profile.defaultProps = {
};
