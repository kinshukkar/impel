import {
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'utils/axios-base';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_AUTH_CHECK,
} from './constants';
import {
  userLoginInitiate,
  userLoginSuccess,
  userLoginError,
  // userLogoutInitiate,
  userLogoutSuccess,
  // userLogoutError,
  userAuthCheckInitiate,
  userAuthCheckSuccess,
  userAuthCheckError,
  // userAuthClear,
} from './actions';


export function* userLogoutSaga() {
  yield call([localStorage, 'removeItem'], 'session_token');
  yield call([localStorage, 'removeItem'], 'user_email');
  yield call([localStorage, 'removeItem'], 'provider_name');
  yield call([localStorage, 'removeItem'], 'provider_id');
  yield call([localStorage, 'removeItem'], 'persist:root');
  yield put(userLogoutSuccess());
}


export function* userLoginSaga(action) {
  yield put(userLoginInitiate());
  const { payload } = action;
  const { username, password, pushRoute } = payload;
  try {
    const config = {
      headers: {
      },
    };
    const response = yield axios.post('/login', {
      email: username,
      password,
    }, config);
    if (response.status === 200) {
      yield localStorage.setItem(
        'session_token',
        `demo-${response.data.id}`,
      );
      yield localStorage.setItem(
        'user_email',
        username,
      );
      yield localStorage.setItem(
        'provider_name',
        `${response.data.name}`,
      );
      yield localStorage.setItem(
        'provider_id',
        `${response.data.id}`,
      );
      yield put(userLoginSuccess({
        id: 1,
        email: username,
        sessionToken: `demo-${response.data.id}`,
      }));
      yield put(pushRoute());
    }
  } catch (err) {
    const errorMessage = { errorMessage: err.response.data };
    console.log('error', errorMessage);
    yield put(userLoginError(errorMessage));
  }
}

export function* userAuthCheckSaga() {
  yield put(userAuthCheckInitiate());
  // const session_token = yield localStorage.getItem('session_token');
  // const userEmail = yield localStorage.getItem('user_email');
  // if (!session_token) {
  //   yield put(userAuthCheckError());
  // }
  // if (session_token && session_token.indexOf('demo') < 0) {
  //   yield put(userAuthCheckError());
  // } else {
  //   const [, id] = session_token.split('-');
  //   yield put(userAuthCheckSuccess({
  //     id,
  //     email: userEmail || 'demo',
  //     sessionToken: session_token,
  //   }));
  // }
  yield put(userAuthCheckSuccess({
    id: '1',
    email: 'demo',
    // sessionToken: session_token,
  }));
}

export default function* userAuth() {
  yield takeLatest(USER_LOGIN, userLoginSaga);
  yield takeLatest(USER_LOGOUT, userLogoutSaga);
  yield takeLatest(USER_AUTH_CHECK, userAuthCheckSaga);
}
