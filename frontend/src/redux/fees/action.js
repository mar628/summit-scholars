import { FEE_LIST, STUDENT_FEE_LIST, CLEAR_FEE_ERRORS, RESET_FEE_STATE } from './constant';
import Service from '@/services';
import { getAccessToken } from '@/helpers/local-storage';

const BASE = '/fee';

const getFeesListAction = (params = {}) => async (dispatch) => {
  dispatch({ type: FEE_LIST.request });
  const token = getAccessToken();
  const query = new URLSearchParams(params).toString();
  const response = await Service.fetchGet(`${BASE}${query ? '?' + query : ''}`, token);
  if (response[0] === true) {
    dispatch({ type: FEE_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({ type: FEE_LIST.fail, payload: response[1] });
  }
};

const getStudentFeesAction = (studentId) => async (dispatch) => {
  dispatch({ type: STUDENT_FEE_LIST.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(`${BASE}/student/${studentId}`, token);
  if (response[0] === true) {
    dispatch({ type: STUDENT_FEE_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({ type: STUDENT_FEE_LIST.fail, payload: response[1] });
  }
};

const getMyFeesAction = () => async (dispatch) => {
  dispatch({ type: STUDENT_FEE_LIST.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(`${BASE}/my-fees`, token);
  if (response[0] === true) {
    dispatch({ type: STUDENT_FEE_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({ type: STUDENT_FEE_LIST.fail, payload: response[1] });
  }
};

const createFeeAction = async (json) => {
  const token = getAccessToken();
  return await Service.fetchPost(`${BASE}/`, json, token);
};

const updateFeeAction = async (feeId, json) => {
  const token = getAccessToken();
  return await Service.fetchPut(`${BASE}/${feeId}`, json, token);
};

const deleteFeeAction = async (feeId) => {
  const token = getAccessToken();
  return await Service.fetchDelete(`${BASE}/${feeId}`, token);
};

const clearFeeErrorsAction = () => (dispatch) => dispatch({ type: CLEAR_FEE_ERRORS });
const resetFeeAction = () => (dispatch) => dispatch({ type: RESET_FEE_STATE });

export default {
  getFeesListAction,
  getStudentFeesAction,
  getMyFeesAction,
  createFeeAction,
  updateFeeAction,
  deleteFeeAction,
  clearFeeErrorsAction,
  resetFeeAction,
};
