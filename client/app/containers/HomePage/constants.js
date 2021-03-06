/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const GET_ACTIVE_CHALLENGES = 'impel-app/Home/GET_ACTIVE_CHALLENGES';
export const GET_USER_JOINED_CHALLENGES = 'impel-app/Home/GET_USER_JOINED_CHALLENGES';
export const JOIN_CHALLENGE = 'impel-app/Home/JOIN_CHALLENGE';

export const UPDATE_HOME_REDUCER = 'impel-app/Home/UPDATE_HOME_REDUCER';
export const RESET_HOME_STATE = 'impel-app/Home/RESET_HOME_STATE';
