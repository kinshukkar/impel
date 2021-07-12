/* eslint-disable */
import {
  put,
  call,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  wallet,
} from '@cityofzion/neon-js';
import { getActiveChallenges, getUserChallenges, getChallengeDetails } from 'utils/neon';
import { cloneDeep } from 'lodash';
import {
  GET_ACTIVE_CHALLENGES, GET_USER_JOINED_CHALLENGES, JOIN_CHALLENGE,
} from './constants';
import {
  updateHomeReducer,
} from './actions';
import { makeSelectGlobal } from '../App/selectors';
import { makeSelectHome } from './selectors';

function* getActiveChallengesSaga() {
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

function* getUserJoinedChallengeDetails(challengeId) {
  try {
    const response = yield getChallengeDetails(challengeId);
    console.log('response--', response);
    return response;
  } catch (err) {
    console.log('could not fetch getUserJoinedChallengeDetails--', err);
  }
}

function* getUserJoinedChallengesSaga(action) {
  const { provider_address } = action.payload;
  yield put(updateHomeReducer({
    getUserJoinedChallengesStatus: 'loading',
  }));
  try {
    const response = yield getUserChallenges(provider_address);
    console.log('getUserJoinedChallenges response--', response);
    // const homeState = yield select(makeSelectHome());
    // const { activeChallenges } = cloneDeep(homeState);
    const merged = [];

    for (let i = 0; i < response.length; i += 1) {
      try {
        const joinedChallengeDetails = yield getUserJoinedChallengeDetails(response[i].challengeId);
        merged.push({ ...response[i], ...joinedChallengeDetails });
      } catch (err) {
        console.log(err);
      }
    }
    yield put(updateHomeReducer({
      getUserJoinedChallengesStatus: 'success',
      userJoinedChallenges: merged,
    }));
  } catch (err) {
    console.log('getUserJoinedChallenges err--', err);
    yield put(updateHomeReducer({
      getUserJoinedChallengesStatus: 'error',
    }));
  }
}

function* addChallengeToJoinedChallenges(challengeId) {
  const homeState = yield select(makeSelectHome());
  const { activeChallenges, userJoinedChallenges } = cloneDeep(homeState);
  const addedChallenge = activeChallenges.find((challenge) => Number(challenge.id) === challengeId);
  userJoinedChallenges.unshift(addedChallenge);
  yield put(updateHomeReducer({
    joinChallengeStatus: 'success',
    userJoinedChallenges,
  }));
}


/* *** Joining a challenge with challengeId** * */
function* joinChallengeSaga(action) {
  const {
    neoN3Data,
    challengeId,
    gasAmount,
  } = action.payload;
  yield put(updateHomeReducer({ joinChallengeStatus: 'loading' }));
  const globalState = yield select(makeSelectGlobal());
  const { walletDetails } = cloneDeep(globalState);
  const {
    provider_address,
  } = walletDetails;
  const invokeFn = yield neoN3Data.invoke({
    scriptHash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    operation: 'transfer',
    args: [
      {
        type: 'Address',
        value: provider_address,
      },
      {
        type: 'Address',
        value: 'NLXRiExdSTXbfnwmb7r8bFcM6FNdNZsmwc',
      },
      {
        type: 'Integer',
        value: gasAmount,
      },
      {
        type: 'Array',
        value: [
          {
            type: 'String',
            value: 'join_challenge',
          },
          {
            type: 'Integer',
            value: challengeId,
          },
        ],
      },
    ],
    fee: '0.0001',
    broadcastOverride: false, // try both true and false, whatever works
    signers: [
      {
        account: new wallet.Account(provider_address).scriptHash,
        scopes: 128,
      },
    ],
  });
  console.log('result--', invokeFn);
  if (invokeFn.txid) {
    yield addChallengeToJoinedChallenges(challengeId);
  }
  // .then((result) => {
  //   console.log('Invoke transaction success!');
  //   console.log(`Transaction ID: ${result.txid}`);
  //   console.log(`RPC node URL: ${result.nodeURL}`);
  //   // addChallengeToJoinedChallenges(challengeId).next();
  // })
  // .catch(({ type, description, data }) => {
  //   addChallengeToJoinedChallenges('1').next();
  //   switch (type) {
  //     case 'NO_PROVIDER':
  //       console.log('No provider available.');
  //       break;
  //     case 'RPC_ERROR':
  //       console.log('There was an error when broadcasting this transaction to the network.');
  //       break;
  //     case 'CANCELED':
  //       console.log('The user has canceled this transaction.');
  //       break;
  //     default:
  //       console.log('Nothing.');
  //   }
  // });
}

export default function* home() {
  yield takeLatest(GET_ACTIVE_CHALLENGES, getActiveChallengesSaga);
  yield takeLatest(GET_USER_JOINED_CHALLENGES, getUserJoinedChallengesSaga);
  yield takeLatest(JOIN_CHALLENGE, joinChallengeSaga);
}
