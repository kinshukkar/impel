import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProtectedRoute from '../ProtectedRoute';

/* eslint-disable react/jsx-props-no-spreading */
const CustomRoute = ({
  isProtected,
  centralAuth,
  ...rest
}) => (
  isProtected ? (
    <ProtectedRoute
      centralAuth={centralAuth}
      {...rest}
    />
  ) : (
    <Route
      {...rest}
    />
  )
);

CustomRoute.propTypes = {
  isProtected: PropTypes.bool.isRequired,
  centralAuth: PropTypes.any.isRequired,
};

export default withRouter(CustomRoute);
