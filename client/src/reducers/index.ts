/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import history from '../helpers/history';
import { connectRouter } from 'connected-react-router';
// import globalReducer from 'containers/App/reducers/appReducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    // global: globalReducer,
  });

  return rootReducer;
}
