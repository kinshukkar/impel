/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, {
  Suspense,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ProtectedRoute from 'components/React/ProtectedRoute';
import MainLayout from 'containers/MainLayout';
import AuthLayout from 'containers/AuthLayout/loadable';

import {
  makeSelectIsAuthenticated,
  makeSelectIsLoginFetching,
  makeSelectIsUserRegistered,
} from 'containers/App/selectors';
import { userAuthCheck } from 'containers/App/actions';
import '../../global-styles.scss';


const App = (props) => {
  const {
    isAuthenticated,
    isUserRegistered,
    isLoginFetching,
    tryAutoLogin,
  } = props;

  useEffect(() => {
    tryAutoLogin();
  }, [isAuthenticated, isUserRegistered]);

  return (
    <>
      <Helmet
        titleTemplate="%s"
        defaultTitle="Impel"
      >
        <title>Impel - Get Fitter with Rewards</title>
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        {
          !isLoginFetching ? (
            <Switch>
              <Route path="/auth" component={AuthLayout} />
              <ProtectedRoute
                centralAuth={{ isAuthenticated, isUserRegistered }}
                path="/"
                component={MainLayout}
              />
            </Switch>
          ) : null
        }
      </Suspense>
      <footer className="footer">Copyright &copy; Team Impel </footer>
    </>
  );
};

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isUserRegistered: PropTypes.bool,
  isLoginFetching: PropTypes.bool.isRequired,
  tryAutoLogin: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
  isLoginFetching: makeSelectIsLoginFetching(),
  isUserRegistered: makeSelectIsUserRegistered(),
});

export const mapDispatchToProps = (dispatch) => {
  return {
    tryAutoLogin: () => dispatch(userAuthCheck()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
