import { TEACHER_LIST, CLEAR_TEACHER_ERRORS, RESET_TEACHER_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  teachersList: null,
};

export const TeacherReducer = (state = initialState, action) => {
  const actionHandlers = {
    [TEACHER_LIST.request]: () => ({ ...state, loading: true }),
    [TEACHER_LIST.success]: () => ({ ...state, loading: false, teachersList: action.payload }),
    [TEACHER_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Failed to load teachers',
      statusCode: action?.payload?.statusCode || 500,
    }),
    [TEACHER_LIST.update]: () => ({ ...state, teachersList: action.payload }),
    [CLEAR_TEACHER_ERRORS]: () => ({ ...state, statusCode: null, error: null }),
    [RESET_TEACHER_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
