import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

export const PropsRoute = ({ component, ...rest }) => (
  <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)} />
);

export const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={routeProps =>
      (rest.profile.auth ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: routeProps.location },
          }}
        />
      ))
    }
  />
);

PropsRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
