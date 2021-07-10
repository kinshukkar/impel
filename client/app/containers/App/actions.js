/*
 * App Actions
 *
 * Actions change things in your application
 * Since this app uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  USER_LOGIN,
  USER_LOGIN_INITIATE,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,

  USER_LOGOUT,
  USER_LOGOUT_INITIATE,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERROR,

  USER_AUTH_CHECK,
  USER_AUTH_CHECK_INITIATE,
  USER_AUTH_CHECK_SUCCESS,
  USER_AUTH_CHECK_ERROR,

  USER_AUTH_CLEAR,
  USER_REGISTRATION_CHECK,
  USER_REGISTRATION_INITIATE,
  USER_REGISTRATION_SUCCESS,
  USER_REGISTRATION_ERROR,
  USER_REGISTER,
} from './constants';

export const userLogin = (payload) => {
  return {
    type: USER_LOGIN,
    payload,
  };
};

export const userLoginInitiate = () => {
  return {
    type: USER_LOGIN_INITIATE,
  };
};

export const userLoginSuccess = (payload) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload,
  };
};

export const userLoginError = (error) => {
  return {
    type: USER_LOGIN_ERROR,
    error,
  };
};

export const userLogout = (payload) => {
  return {
    type: USER_LOGOUT,
    payload,
  };
};

export const userLogoutInitiate = () => {
  return {
    type: USER_LOGOUT_INITIATE,
  };
};

export const userLogoutSuccess = () => {
  return {
    type: USER_LOGOUT_SUCCESS,
  };
};

export const userLogoutError = () => {
  return {
    type: USER_LOGOUT_ERROR,
  };
};

export const userAuthCheck = () => {
  return {
    type: USER_AUTH_CHECK,
  };
};

export const userAuthCheckInitiate = () => {
  return {
    type: USER_AUTH_CHECK_INITIATE,
  };
};

export const userAuthCheckSuccess = (payload) => {
  return {
    type: USER_AUTH_CHECK_SUCCESS,
    payload,
  };
};

export const userAuthCheckError = (error) => {
  return {
    type: USER_AUTH_CHECK_ERROR,
    error,
  };
};

export const userAuthClear = () => {
  return {
    type: USER_AUTH_CLEAR,
  };
};

export const userRegistrationCheck = () => {
  return {
    type: USER_REGISTRATION_CHECK,
  };
};

export const userRegistrationInitiate = () => {
  return {
    type: USER_REGISTRATION_INITIATE,
  };
};

export const userRegistrationSuccess = (payload) => {
  return {
    type: USER_REGISTRATION_SUCCESS,
    payload,
  };
};

export const userRegistrationError = (error) => {
  return {
    type: USER_REGISTRATION_ERROR,
    error,
  };
};

export const userRegister = (payload) => {
  return {
    type: USER_REGISTER,
    payload,
  };
};
