import {
  put,
  call,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { cloneDeep } from 'lodash';
import { push } from 'connected-react-router';
import { getUser, createUser } from 'utils/neon';
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_AUTH_CHECK,
  USER_REGISTRATION_CHECK,
  USER_REGISTER,
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
  userRegistrationCheck,
  // userAuthClear,
} from './actions';
import { makeSelectGlobal } from './selectors';

function* userLogoutSaga() {
  yield call([localStorage, 'removeItem'], 'provider_address');
  yield call([localStorage, 'removeItem'], 'provider_label');
  yield call([localStorage, 'removeItem'], 'persist:root');
  yield put(userLogoutSuccess());
  yield put(push('/auth/login'));
  // hack
  window.location.reload();
}

// check if user registered and associated with this wallet
function* userRegistrationCheckSaga() {
  console.log('inside userRegistrationCheckSaga');
  const globalState = yield select(makeSelectGlobal());
  const { walletDetails } = cloneDeep(globalState);
  const {
    provider_address,
  } = walletDetails;
  const response = yield getUser(provider_address);
  console.log('responseeee----', response);
  if (response) {
    yield put(userRegistrationSuccess({
      user_name: response,
    }));
  } else {
    console.log('userRegistrationError----');
    yield put(userRegistrationError());
  }
}

function* userRegisterSaga(action) {
  const { user_name, pushRoute } = action.payload;
  const globalState = yield select(makeSelectGlobal());
  const { walletDetails } = cloneDeep(globalState);
  const {
    provider_address,
  } = walletDetails;
  try {
    const response = yield createUser(provider_address, user_name);
    console.log('response--', response);
    yield localStorage.setItem(
      'user_name',
      user_name,
    );
    yield put(userRegistrationSuccess({
      user_name,
    }));
    yield put(pushRoute());
  } catch (err) {
    console.log('User could not be registered--', err);
  }
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
      provider_label,
      provider_address,
    }));
  } else {
    yield put(userAuthCheckError());
  }
  try {
    yield call(userRegistrationCheckSaga);
    yield put(pushRoute());
  } catch (err) {
    // const errorMessage = { errorMessage: err.response.data };
    console.log('error', err);
  }
}


export function* userLoginSaga(action) {
  yield put(userLoginInitiate());
  const { neoN3Data, pushRoute } = action.payload;
  try {
    console.log('inside saga--', neoN3Data);
    if (Object.keys(neoN3Data).length > 0) {
      yield call(sendLoginRequest, neoN3Data, pushRoute);
    }
  } catch (err) {
    // const errorMessage = { errorMessage: err.response.data };
    console.log('error', err);
    yield put(userLoginError(err));
  }
}

export function* userAuthCheckSaga() {
  console.log('inside userAuthCheckSaga');
  yield put(userAuthCheckInitiate());
  const provider_address = yield localStorage.getItem('provider_address');
  const provider_label = yield localStorage.getItem('provider_label');
  console.log('inside userAuthCheckSaga details', provider_address);
  if (!provider_address) {
    yield put(userAuthCheckError());
  } else {
    yield put(userAuthCheckSuccess({
      provider_label,
      provider_address,
    }));
    try {
      console.log('inside userRegistrationCheckSaga try block');
      yield call(userRegistrationCheckSaga);
      yield put(push('/home'));
    } catch (err) {
      console.log('inside userRegistrationCheckSaga catch block');
      // const errorMessage = { errorMessage: err.response.data };
      console.log('error', err);
    }
  }
}

export default function* userAuth() {
  yield takeLatest(USER_LOGIN, userLoginSaga);
  yield takeLatest(USER_LOGOUT, userLogoutSaga);
  yield takeLatest(USER_AUTH_CHECK, userAuthCheckSaga);
  // yield takeLatest(USER_REGISTRATION_CHECK, userRegistrationCheckSaga);
  yield takeLatest(USER_REGISTER, userRegisterSaga);
}
