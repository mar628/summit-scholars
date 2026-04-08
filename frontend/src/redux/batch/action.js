import { BATCH_LIST, CLEAR_BATCH_ERRORS, RESET_BATCH_STATE } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';

const getBatchesListAction = () => async (dispatch) => {
  dispatch({ type: BATCH_LIST.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(`${API.BASE_BATCH}${API.BASE_ACTIONS_TYPES.LIST}`, token);
  if (response[0] === true) {
    dispatch({ type: BATCH_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({ type: BATCH_LIST.fail, payload: response[1] });
  }
};

const createNewBatchAction = async (json) => {
  const token = getAccessToken();
  return await Service.fetchPost(`${API.BASE_BATCH}${API.BASE_ACTIONS_TYPES.NEW_BATCH}`, json, token);
};

const updateBatchAction = async (batchId, json) => {
  const token = getAccessToken();
  return await Service.fetchPut(`${API.BASE_BATCH}/${batchId}`, json, token);
};

const toggleBatchStatusAction = async (batchId) => {
  const token = getAccessToken();
  return await Service.fetchPatch(`${API.BASE_BATCH}/${batchId}/toggle-status`, {}, token);
};

const deleteBatchAction = async (batchId) => {
  const token = getAccessToken();
  return await Service.fetchDelete(`${API.BASE_BATCH}/${batchId}`, token);
};

const clearBatchErrorsAction = () => (dispatch) => {
  dispatch({ type: CLEAR_BATCH_ERRORS });
};

const resetBatchAction = () => (dispatch) => {
  dispatch({ type: RESET_BATCH_STATE });
};

export default {
  getBatchesListAction,
  createNewBatchAction,
  updateBatchAction,
  toggleBatchStatusAction,
  deleteBatchAction,
  clearBatchErrorsAction,
  resetBatchAction,
};
