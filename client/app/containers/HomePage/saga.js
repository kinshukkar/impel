import {
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'utils/axios-base';
import { push } from 'connected-react-router';
import { getActiveChallenges } from 'utils/neon';
import {
  GET_ACTIVE_CHALLENGES,
} from './constants';
import {
  updateHomeReducer,
} from './actions';

export function* getActiveChallengesSaga() {
  yield put(updateHomeReducer({
    getActiveChallengesStatus: 'loading',
  }));
  try {
    const response = yield getActiveChallenges();
    console.log('getActiveChallenges response--', response);
    yield put(updateHomeReducer({
      getActiveChallengesStatus: 'success',
      activeChallenges: response,
    }));
  } catch (err) {
    console.log('getActiveChallenges err--', err);
    yield put(updateHomeReducer({
      getActiveChallengesStatus: 'error',
    }));
  }
}


export default function* home() {
  yield takeLatest(GET_ACTIVE_CHALLENGES, getActiveChallengesSaga);
}
