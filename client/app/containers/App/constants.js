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

export const USER_LOGIN = 'boilerplate-app/App/USER_LOGIN';
export const USER_LOGIN_INITIATE = 'boilerplate-app/App/USER_LOGIN_INITIATE';
export const USER_LOGIN_SUCCESS = 'boilerplate-app/App/USER_LOGIN_SUCCESS';
export const USER_LOGIN_ERROR = 'boilerplate-app/App/USER_LOGIN_ERROR';

export const USER_LOGOUT = 'boilerplate-app/App/USER_LOGOUT';
export const USER_LOGOUT_INITIATE = 'boilerplate-app/App/USER_LOGOUT_INITIATE';
export const USER_LOGOUT_SUCCESS = 'boilerplate-app/App/USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_ERROR = 'boilerplate-app/App/USER_LOGOUT_ERROR';

export const USER_AUTH_CHECK = 'boilerplate-app/App/USER_AUTH_CHECK';
export const USER_AUTH_CHECK_INITIATE = 'boilerplate-app/App/USER_AUTH_CHECK_INITIATE';
export const USER_AUTH_CHECK_SUCCESS = 'boilerplate-app/App/USER_AUTH_CHECK_SUCCESS';
export const USER_AUTH_CHECK_ERROR = 'boilerplate-app/App/USER_AUTH_CHECK_ERROR';

export const USER_AUTH_CLEAR = 'boilerplate-app/App/USER_AUTH_CLEAR';
