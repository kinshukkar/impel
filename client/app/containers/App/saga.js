import {
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'utils/axios-base';
import { push } from 'connected-react-router';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_AUTH_CHECK,
  USER_REGISTRATION_CHECK,
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
  userRegistrationInitiate,
  userRegistrationSuccess,
  userRegistrationError,
  // userAuthClear,
} from './actions';

export function* userLogoutSaga() {
  yield call([localStorage, 'removeItem'], 'provider_address');
  yield call([localStorage, 'removeItem'], 'provider_label');
  yield call([localStorage, 'removeItem'], 'persist:root');
  yield put(userLogoutSuccess());
  yield put(push('/auth/login'));
  // hack
  window.location.reload();
}

function* sendLoginRequest(neoN3Data, pushRoute) {
  let provider_address; let
    provider_label;
  yield neoN3Data.getAccount()
    .then((account) => {
      const {
        address,
        label,
      } = account;
      provider_address = address;
      console.log(`Provider address: ${address}`);
      console.log(`Provider account label (Optional): ${label}`);
    });
  yield neoN3Data.pickAddress()
    .then((data) => {
      const {
        address,
        label,
      } = data;
      provider_label = label;
      console.log(`pickAddress: ${address} ${label}`);
    });
  yield localStorage.setItem(
    'provider_address',
    provider_address,
  );
  yield localStorage.setItem(
    'provider_label',
    provider_label,
  );

  if (provider_address) {
    yield put(userAuthCheckSuccess({
      // id: '1',
      provider_label,
      provider_address,
    }));
  } else {
    yield put(userAuthCheckError());
  }
  yield put(userRegistrationSuccess());
  // yield put(userRegistrationError());
  yield put(pushRoute());
}


export function* userLoginSaga(action) {
  yield put(userLoginInitiate());
  const { neoN3Data, pushRoute } = action.payload;
  try {
    console.log('inside saga--', neoN3Data);
    if (Object.keys(neoN3Data).length > 0) {
      yield call(sendLoginRequest, neoN3Data, pushRoute);
      // console.log('response--', response);
      // if (response.status === 200) {
      //   console.log('yayy', response);
      //   // yield put(pushRoute());
      // }
    }
    // const response = yield axios.post('/login', {
    //   email: username,
    //   password,
    // }, config);
    // if (response.status === 200) {
    //   yield localStorage.setItem(
    //     'session_token',
    //     `demo-${response.data.id}`,
    //   );
    //   yield localStorage.setItem(
    //     'user_email',
    //     username,
    //   );
    //   yield localStorage.setItem(
    //     'provider_name',
    //     `${response.data.name}`,
    //   );
    //   yield localStorage.setItem(
    //     'provider_id',
    //     `${response.data.id}`,
    //   );
    //   yield put(userLoginSuccess({
    //     id: 1,
    //     email: username,
    //     sessionToken: `demo-${response.data.id}`,
    //   }));
    // }
    // yield put(pushRoute());
  } catch (err) {
    // const errorMessage = { errorMessage: err.response.data };
    console.log('error', err);
    yield put(userLoginError(err));
  }
}

export function* userAuthCheckSaga() {
  yield put(userAuthCheckInitiate());
  const provider_address = yield localStorage.getItem('provider_address');
  const provider_label = yield localStorage.getItem('provider_label');
  if (!provider_address) {
    yield put(userAuthCheckError());
  } else {
    yield put(userAuthCheckSuccess({
      provider_label,
      provider_address,
    }));
  }
}

export function* userRegistrationCheckSaga() {
  yield put(userRegistrationSuccess());
  // yield put(userRegistrationError());
}

export default function* userAuth() {
  yield takeLatest(USER_LOGIN, userLoginSaga);
  yield takeLatest(USER_LOGOUT, userLogoutSaga);
  yield takeLatest(USER_AUTH_CHECK, userAuthCheckSaga);
  yield takeLatest(USER_REGISTRATION_CHECK, userRegistrationCheckSaga);
}
