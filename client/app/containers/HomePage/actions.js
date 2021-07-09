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
  GET_CHALLENGES,
  UPDATE_HOME_REDUCER,
  RESET_HOME_STATE,
} from './constants';

export const getChallenges = (payload) => {
  return {
    type: GET_CHALLENGES,
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
