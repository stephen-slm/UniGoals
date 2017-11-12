import React from 'react';
import PropTypes from 'prop-types';

import Navigation from '../Navigation/Navigation';

const style = require('./home.less');

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={style.homeTitle}>Volunteer Home</div>
        <Navigation authentication={this.props.authentication} />
      </div>
    );
  }
}

Home.propTypes = {
  authentication: PropTypes.shape({
    username: PropTypes.string,
    result: PropTypes.bool,
  }).isRequired,
};
