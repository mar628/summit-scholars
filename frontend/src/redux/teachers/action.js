import { TEACHER_LIST, CLEAR_TEACHER_ERRORS, RESET_TEACHER_STATE } from './constant';
import Service from '@/services';
import { BASE_TEACHER } from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';

const getTeachersListAction = () => async (dispatch) => {
  dispatch({ type: TEACHER_LIST.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(`${BASE_TEACHER}/`, token);
  if (response[0] === true) {
    dispatch({ type: TEACHER_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({ type: TEACHER_LIST.fail, payload: response[1] });
  }
};

const createTeacherAction = async (json) => {
  const token = getAccessToken();
  return await Service.fetchPost(`${BASE_TEACHER}/`, json, token);
};

const updateTeacherAction = async (teacherId, json) => {
  const token = getAccessToken();
  return await Service.fetchPut(`${BASE_TEACHER}/${teacherId}`, json, token);
};

const deleteTeacherAction = async (teacherId) => {
  const token = getAccessToken();
  return await Service.fetchDelete(`${BASE_TEACHER}/${teacherId}`, token);
};

const clearTeacherErrorsAction = () => (dispatch) => {
  dispatch({ type: CLEAR_TEACHER_ERRORS });
};

const resetTeacherAction = () => (dispatch) => {
  dispatch({ type: RESET_TEACHER_STATE });
};

export default {
  getTeachersListAction,
  createTeacherAction,
  updateTeacherAction,
  deleteTeacherAction,
  clearTeacherErrorsAction,
  resetTeacherAction,
};
