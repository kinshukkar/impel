import { all, call, fork } from 'redux-saga/effects';

import appSaga from './sagas/appSaga';
// import productInfoSaga from 'containers/App/sagas/productInfoSaga';

function* rootSaga() {
  const sagas = [
    appSaga,
  ];

  yield all(
    sagas.map((saga) => fork(function* () {
      while (true) {
        try {
          yield call(saga);
          break;
        } catch (e) {
          console.log(e);
        }
      }
    })),
  );
}

export default rootSaga;
