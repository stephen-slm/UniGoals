import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

export const PropsRoute = ({ component, ...rest }) => (
  <Route {...rest} render={(routeProps) => renderMergedProps(component, routeProps, rest)} />
);

export const PrivateRoute = ({ component, ...rest }) => {
  if (rest.profile.auth && rest.profile.new && rest.location.pathname !== '/home') {
    return <Route render={(routeProps) => <Redirect to={{ pathname: '/home', state: { from: routeProps.location } }} />} />;
  } else if (rest.profile.auth) {
    return <Route {...rest} render={(routeProps) => renderMergedProps(component, routeProps, rest)} />;
  }

  return <Route render={(routeProps) => <Redirect to={{ pathname: '/login', state: { from: routeProps.location } }} />} />;
};

PropsRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
