import {
    put,
    call,
    takeLatest,
    select,
} from 'redux-saga/effects';
import { updateAppReducer } from '../actions/appActions';
import { getStravaUserDetails } from '../api';
import { STRAVA_USER } from '../constants/appConstants';


/** ******Saga to get experiments********** */
function* getStravaUserDetailsSaga(action) {
    try {
      yield put(updateAppReducer({ stravaUserDetailsFetchStatus: 'loading' }));
      const response = yield getStravaUserDetails(action.payload);
      if (response.status === 200) {
        yield put(updateAppReducer({ stravaUserDetailsFetchStatus: 'success', stravaUser: response.data }));
      } else {
        yield put(updateAppReducer({ stravaUserDetailsFetchStatus: 'error', error: response.data }));
      }
    } catch (err) {
      yield put(updateAppReducer({ stravaUserDetailsFetchStatus: 'error', error: err.response.statusText }));
    }
}
  
export default function* appSaga() {
    // API sagas
    yield takeLatest(STRAVA_USER, getStravaUserDetailsSaga);
}