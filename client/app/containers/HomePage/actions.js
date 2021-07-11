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
  GET_ACTIVE_CHALLENGES,
  UPDATE_HOME_REDUCER,
  RESET_HOME_STATE,
  GET_USER_JOINED_CHALLENGES,
  JOIN_CHALLENGE,
} from './constants';

export const getAllActiveChallenges = (payload) => {
  return {
    type: GET_ACTIVE_CHALLENGES,
    payload,
  };
};

export const getUserJoinedChallenges = (payload) => {
  return {
    type: GET_USER_JOINED_CHALLENGES,
    payload,
  };
};

export const joinChallenge = (payload) => {
  return {
    type: JOIN_CHALLENGE,
    payload,
  };
};


export const resetHomeState = (reducerState) => {
  return {
    type: RESET_HOME_STATE,
    reducerState,
  };
};

// -------------actions triggered from saga to update state -----------

export const updateHomeReducer = (payload) => {
  return {
    type: UPDATE_HOME_REDUCER,
    payload,
  };
};
