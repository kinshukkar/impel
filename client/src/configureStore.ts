/* eslint-disable no-mixed-operators */
/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createFilter } from 'redux-persist-transform-filter';
import { routerMiddleware } from 'connected-react-router';
import { State } from './reducers/types';
import history from './helpers/history';
import createReducer from './reducers';
import rootSaga from './rootSagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

declare var module: any

const persistConfig: PersistConfig<State> = {
  key: 'root',
  storage,
  whitelist: ['global'],
  transforms: [
    createFilter('global', ['userDetails']),
  ],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, createReducer());

export default function configureStore(initialState = {}) {
  let composeEnhancers = compose;
  const reduxSagaMonitorOptions = {};

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }
    /* eslint-enable */
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    routerMiddleware(history),
    sagaMiddleware,
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(...enhancers),
  );

  sagaMiddleware.run(rootSaga);
  // Extensions
  // store.runSaga = sagaMiddleware.run;
  // store.injectedReducers = {}; // Reducer registry
  // store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const newCreateReducer = require('./reducers').default;
      const newReducer = newCreateReducer();
      store.replaceReducer(newReducer);
    });
  }

  return store;
}
