import { BATCH_LIST, CLEAR_BATCH_ERRORS, RESET_BATCH_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  batchesList: null,
};

export const BatchReducer = (state = initialState, action) => {
  const actionHandlers = {
    [BATCH_LIST.request]: () => ({ ...state, loading: true }),
    [BATCH_LIST.success]: () => ({ ...state, loading: false, batchesList: action.payload }),
    [BATCH_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Failed to load batches',
      statusCode: action?.payload?.statusCode || 500,
    }),
    [BATCH_LIST.update]: () => ({ ...state, batchesList: action.payload }),
    [CLEAR_BATCH_ERRORS]: () => ({ ...state, statusCode: null, error: null }),
    [RESET_BATCH_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
