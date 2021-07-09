import {
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'utils/axios-base';
import { push } from 'connected-react-router';
import {
  GET_CHALLENGES,
} from './constants';
import {
  getChallenges,
} from './actions';
import {
  getAllChallenges,
} from '../../api';

export function* getChallengesSaga(action) {
  // TODO
}


export default function* userAuth() {
  yield takeLatest(GET_CHALLENGES, getChallengesSaga);
}
