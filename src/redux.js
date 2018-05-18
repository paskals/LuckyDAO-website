// action types
const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
const ACCOUNT_SUCCESS = 'ACCOUNT_SUCCESS';
const ACCOUNT_FAILURE = 'ACCOUNT_FAILURE';

const INFO_REQUEST = 'INFO_REQUEST';
const INFO_SUCCESS = 'INFO_SUCCESS';
const INFO_FAILURE = 'INFO_FAILURE';

const COMMIT_REQUEST = 'COMMIT_REQUEST';
const COMMIT_SUCCESS = 'COMMIT_SUCCESS';
const COMMIT_FAILURE = 'COMMIT_FAILURE';

// reducer with initial state
const initialState = {
  fetching: false,
  account: null,
  info: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_REQUEST:
      return { ...state, fetching: true, error: null };
    case ACCOUNT_SUCCESS:
      return { ...state, fetching: false, account: action.account };
    case ACCOUNT_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    case INFO_REQUEST:
      return { ...state, fetching: true, error: null };
    case INFO_SUCCESS:
      return { ...state, fetching: false, info: action.info };
    case INFO_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    case COMMIT_REQUEST:
      return { ...state, fetching: true, error: null };
    case COMMIT_SUCCESS:
      return { ...state, fetching: false, data: action.data };
    case COMMIT_FAILURE:
      return {
        ...state, fetching: false, data: null, error: action.error
      };
    default:
      return state;
  }
}
