import {
    RESET_APP_STATE,
    STRAVA_USER,
    UPDATE_APP_REDUCER,
} from '../constants/appConstants';

export const getStravaUserDetails = () => {
    return {
      type: STRAVA_USER,
    };
};

export const resetAppState = (reducerState) => {
    return {
      type: RESET_APP_STATE,
      reducerState,
    };
  };
  
  // -------------actions triggered from saga to update state -----------
  
  export const updateAppReducer = (payload) => {
    return {
      type: UPDATE_APP_REDUCER,
      payload,
    };
  };