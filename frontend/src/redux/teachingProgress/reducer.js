import { PROGRESS_LIST, CLEAR_PROGRESS_ERRORS, RESET_PROGRESS_STATE } from './constant';
const initialState = { loading: false, error: null, progressList: null };
export const TeachingProgressReducer = (state = initialState, action) => {
  const h = {
    [PROGRESS_LIST.request]: () => ({ ...state, loading: true }),
    [PROGRESS_LIST.success]: () => ({ ...state, loading: false, progressList: action.payload }),
    [PROGRESS_LIST.fail]: () => ({ ...state, loading: false, error: action?.payload?.message }),
    [PROGRESS_LIST.update]: () => ({ ...state, progressList: action.payload }),
    [CLEAR_PROGRESS_ERRORS]: () => ({ ...state, error: null }),
    [RESET_PROGRESS_STATE]: () => initialState,
  };
  return h[action.type] ? h[action.type]() : state;
};
