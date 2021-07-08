import { all, call, fork } from 'redux-saga/effects';

import globalSaga from 'containers/App/saga';


function* rootSaga() {
  const sagas = [
    globalSaga,
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
