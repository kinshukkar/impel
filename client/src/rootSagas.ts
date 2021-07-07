import { all, call, fork } from 'redux-saga/effects';

// import authSaga from 'containers/App/sagas/authSaga';
// import productInfoSaga from 'containers/App/sagas/productInfoSaga';

function* rootSaga() {
  const sagas = [
    // authSaga,
    // productInfoSaga,
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
