import { all, call, fork } from 'redux-saga/effects';

import globalSaga from 'containers/App/saga';
import homeSaga from 'containers/HomePage/saga';


function* rootSaga() {
  const sagas = [
    globalSaga,
    homeSaga,
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
