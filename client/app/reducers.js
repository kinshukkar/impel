/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';

import globalReducer from 'containers/App/reducer';
import homeReducer from 'containers/HomePage/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
  const rootReducer = combineReducers({
    global: globalReducer,
    home: homeReducer,
  });

  return rootReducer;
}
