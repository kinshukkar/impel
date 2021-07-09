/**
 * App selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;

const makeSelectIsAuthenticated = () => (
  createSelector(
    selectGlobal,
    (globalState) => globalState.isAuthenticated,
  )
);

const makeSelectIsLoginFetching = () => (
  createSelector(
    selectGlobal,
    (globalState) => globalState.isLoginFetching,
  )
);

const makeSelectIsUserRegistered = () => (
  createSelector(
    selectGlobal,
    (globalState) => globalState.isUserRegistered,
  )
);

export {
  selectGlobal,
  makeSelectIsAuthenticated,
  makeSelectIsLoginFetching,
  makeSelectIsUserRegistered,
};
