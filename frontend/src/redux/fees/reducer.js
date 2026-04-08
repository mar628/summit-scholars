import { FEE_LIST, STUDENT_FEE_LIST, CLEAR_FEE_ERRORS, RESET_FEE_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  feesList: null,
  studentFeesList: null,
};

export const FeeReducer = (state = initialState, action) => {
  const handlers = {
    [FEE_LIST.request]: () => ({ ...state, loading: true }),
    [FEE_LIST.success]: () => ({ ...state, loading: false, feesList: action.payload }),
    [FEE_LIST.fail]: () => ({ ...state, loading: false, error: action?.payload?.message, statusCode: action?.payload?.statusCode }),
    [FEE_LIST.update]: () => ({ ...state, feesList: action.payload }),
    [STUDENT_FEE_LIST.request]: () => ({ ...state, loading: true }),
    [STUDENT_FEE_LIST.success]: () => ({ ...state, loading: false, studentFeesList: action.payload }),
    [STUDENT_FEE_LIST.fail]: () => ({ ...state, loading: false, error: action?.payload?.message }),
    [STUDENT_FEE_LIST.update]: () => ({ ...state, studentFeesList: action.payload }),
    [CLEAR_FEE_ERRORS]: () => ({ ...state, error: null, statusCode: null }),
    [RESET_FEE_STATE]: () => initialState,
  };
  return handlers[action.type] ? handlers[action.type]() : state;
};
