import { PROGRESS_LIST, CLEAR_PROGRESS_ERRORS, RESET_PROGRESS_STATE } from './constant';
import Service from '@/services';
import { getAccessToken } from '@/helpers/local-storage';

const BASE = '/teaching-progress';

const getMyProgressAction = () => async (dispatch) => {
  dispatch({ type: PROGRESS_LIST.request });
  const token = getAccessToken();
  const res = await Service.fetchGet(`${BASE}/`, token);
  if (res[0] === true) dispatch({ type: PROGRESS_LIST.success, payload: res[1]?.data });
  else dispatch({ type: PROGRESS_LIST.fail, payload: res[1] });
};

const createProgressAction = async (json) => {
  const token = getAccessToken();
  return await Service.fetchPost(`${BASE}/`, json, token);
};

const updateProgressAction = async (id, json) => {
  const token = getAccessToken();
  return await Service.fetchPut(`${BASE}/${id}`, json, token);
};

const deleteProgressAction = async (id) => {
  const token = getAccessToken();
  return await Service.fetchDelete(`${BASE}/${id}`, token);
};

const clearProgressErrorsAction = () => (d) => d({ type: CLEAR_PROGRESS_ERRORS });
const resetProgressAction = () => (d) => d({ type: RESET_PROGRESS_STATE });

export default { getMyProgressAction, createProgressAction, updateProgressAction, deleteProgressAction, clearProgressErrorsAction, resetProgressAction };
