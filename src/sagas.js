import { takeLatest, call, put, all } from 'redux-saga/effects';
import api from './api';

// worker saga: makes the api call when watcher saga sees the action
function* workerAccount() {
  try {
    const data = yield call(api.getAccountInfo);
    yield put({ type: 'ACCOUNT_API_CALL_SUCCESS', account: data });
  } catch (error) {
    yield put({ type: 'ACCOUNT_API_CALL_FAILURE', error });
  }
}

function* workerInfo() {
  try {
    const data = yield call(api.getCampainInfo);
    yield put({ type: 'INFO_API_CALL_SUCCESS', info: data });
  } catch (error) {
    yield put({ type: 'INFO_API_CALL_FAILURE', error });
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield all([
    takeLatest('ACCOUNT_API_CALL_REQUEST', workerAccount),
    takeLatest('INFO_API_CALL_REQUEST', workerInfo)
  ]);
}
