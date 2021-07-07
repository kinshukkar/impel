/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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
  UPDATE_APP_REDUCER,
  RESET_APP_STATE,
} from '../constants/appConstants';

// The initial state of the App
export const initialState = {
  // app states
  error: '',
  stravaUserDetailsFetchStatus: '',
  stravaUser: {},
};

/* eslint-disable default-case, no-param-reassign */
// eslint-disable-next-line consistent-return
const appReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case UPDATE_APP_REDUCER:
      for (const k in action.payload) {
        draft[k] = action.payload[k];
      }
      break;
    case RESET_APP_STATE:
      for (const k in action.reducerState) {
        draft[k] = initialState[k];
      }
      break;
    default:
      return state;
  }
});

export default appReducer;
