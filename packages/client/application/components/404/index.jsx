/*
 * @File application\components\Profile\index.jsx
 * @Version 0.0.1
 */
import { withRouter, Redirect } from 'react-router';
import React from 'react';

const FourOfour = () => (
  <Redirect
    to={{
      pathname: '/home',
    }}
  />
);

FourOfour.propTypes = {};

export default withRouter(FourOfour);
