// action types
const ACCOUNT_API_CALL_REQUEST = 'ACCOUNT_API_CALL_REQUEST';
const ACCOUNT_API_CALL_SUCCESS = 'ACCOUNT_API_CALL_SUCCESS';
const ACCOUNT_API_CALL_FAILURE = 'ACCOUNT_API_CALL_FAILURE';

const INFO_API_CALL_REQUEST = 'INFO_API_CALL_REQUEST';
const INFO_API_CALL_SUCCESS = 'INFO_API_CALL_SUCCESS';
const INFO_API_CALL_FAILURE = 'INFO_API_CALL_FAILURE';

const COMMIT_API_CALL_REQUEST = 'COMMIT_API_CALL_REQUEST';
const COMMIT_API_CALL_SUCCESS = 'COMMIT_API_CALL_SUCCESS';
const COMMIT_API_CALL_FAILURE = 'COMMIT_API_CALL_FAILURE';

// reducer with initial state
const initialState = {
  fetching: false,
  account: null,
  info: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_API_CALL_REQUEST:
      return { ...state, fetching: true, error: null };
    case ACCOUNT_API_CALL_SUCCESS:
      return { ...state, fetching: false, account: action.account };
    case ACCOUNT_API_CALL_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    case INFO_API_CALL_REQUEST:
      return { ...state, fetching: true, error: null };
    case INFO_API_CALL_SUCCESS:
      return { ...state, fetching: false, info: action.info };
    case INFO_API_CALL_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    case COMMIT_API_CALL_REQUEST:
      return { ...state, fetching: true, error: null };
    case COMMIT_API_CALL_SUCCESS:
      return { ...state, fetching: false, data: action.data };
    case COMMIT_API_CALL_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    default:
      return state;
  }
}
