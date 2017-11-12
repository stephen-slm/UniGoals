import React from 'react';
import PropTypes from 'prop-types';
// Make sure to use { Link } otherwise you get a error
import { Link } from 'react-router-dom';

import * as routes from '../Application/routePaths';

const style = require('./navigation.less');

export default function Navigation(props) {
  return (
    <div className={style.menuNavigation}>
      navigation
    </div>
  );
}

Navigation.propTypes = {
  authentication: PropTypes.shape().isRequired,
};
