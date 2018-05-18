import { takeLatest, call, put, all } from 'redux-saga/effects';
import api from './api';

function* workerCommit(params) {
  try {
    const data = yield call(api.postCommit, params.weiValue, params.secret);
    yield put({ type: 'COMMIT_SUCCESS', data });
  } catch (error) {
    yield put({ type: 'COMMIT_FAILURE', error });
  }
}

function* workerReveal(params) {
  try {
    const data = yield call(api.postReveal, params.secret);
    yield put({ type: 'REVEAL_SUCCESS', data });
  } catch (error) {
    yield put({ type: 'REVEAL_FAILURE', error });
  }
}

function* workerCreate(params) {
  try {
    const data = yield call(api.postCreate, params.values);
    yield put({ type: 'CREATE_SUCCESS', data });
  } catch (error) {
    yield put({ type: 'CREATE_FAILURE', error });
  }
}

function* workerAccount() {
  try {
    const data = yield call(api.getAccountInfo);
    yield put({ type: 'ACCOUNT_SUCCESS', account: data });
  } catch (error) {
    yield put({ type: 'ACCOUNT_FAILURE', error });
  }
}

function* workerInfo() {
  try {
    const data = yield call(api.getCampainInfo);
    yield put({ type: 'INFO_SUCCESS', info: data });
  } catch (error) {
    yield put({ type: 'INFO_FAILURE', error });
  }
}

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield all([
    takeLatest('ACCOUNT_REQUEST', workerAccount),
    takeLatest('INFO_REQUEST', workerInfo),
    takeLatest('COMMIT_REQUEST', workerCommit),
    takeLatest('REVEAL_REQUEST', workerReveal),
    takeLatest('CREATE_REQUEST', workerCreate)
  ]);
}
