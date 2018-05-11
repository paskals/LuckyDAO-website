import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import Api from './api';

const api = Api();

// function that makes the api request and returns a Promise for response
function getAccount() {
  return api.getAccount().then(acc => acc.length > 0 ? acc[0] : null);
}

// worker saga: makes the api call when watcher saga sees the action
function* workerSaga(params) {
  try {
    const data = yield call(getAccount);

    // dispatch a success action to the store with the new data
    yield put({ type: 'API_CALL_SUCCESS', data });
  } catch (error) {
    // dispatch a failure action to the store with the error
    console.log(error);
    yield put({ type: 'API_CALL_FAILURE', error });
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield takeLatest('API_CALL_REQUEST', workerSaga);
}
