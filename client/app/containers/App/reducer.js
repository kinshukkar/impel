/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
  USER_LOGIN_INITIATE,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,

  // USER_LOGOUT_INITIATE,
  USER_LOGOUT_SUCCESS,
  // USER_LOGOUT_ERROR,

  USER_AUTH_CHECK_INITIATE,
  USER_AUTH_CHECK_SUCCESS,
  USER_AUTH_CHECK_ERROR,
  USER_REGISTRATION_ERROR,
  USER_REGISTRATION_INITIATE,
  USER_REGISTRATION_SUCCESS,

  // USER_AUTH_CLEAR,
} from './constants';

// The initial state of the App
export const initialState = {
  isLoginFetching: true,
  isRegistrationInProgress: true,
  isAuthenticated: false,
  isUserRegistered: false,
  userDetails: {}, // email, session_token
  isLoginError: false,
  isRegistrationError: false,
  userLoginError: {}, // type, msg
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case USER_LOGIN_INITIATE:
    case USER_AUTH_CHECK_INITIATE:
      draft.isLoginFetching = true;
      break;

    case USER_REGISTRATION_INITIATE:
      draft.isRegistrationInProgress = true;
      break;

    case USER_LOGIN_SUCCESS:
    case USER_AUTH_CHECK_SUCCESS:
      draft.isLoginFetching = false;
      draft.isAuthenticated = true;
      draft.userDetails = {
        // id: action.payload.id,
        provider_label: action.payload.provider_label,
        provider_address: action.payload.provider_address,
      };
      break;

    case USER_REGISTRATION_SUCCESS:
      draft.isRegistrationInProgress = false;
      draft.isUserRegistered = true;
      break;

    case USER_REGISTRATION_ERROR:
      draft.isRegistrationError = true;
      draft.isRegistrationInProgress = false;
      break;
    case USER_LOGIN_ERROR:
    case USER_AUTH_CHECK_ERROR:
      draft.isLoginFetching = false;
      draft.isLoginError = true;
      draft.userLoginError = {}; // action payload
      break;

    case USER_LOGOUT_SUCCESS:
      draft.isAuthenticated = false;
      draft.userDetails = {};
      break;
  }
});

export default appReducer;
