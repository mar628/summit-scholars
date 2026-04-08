export const BASE_TEACHER = '/teacher';
export const TEACHER_ACTIONS = {
  LIST: '/',
  CREATE: '/',
  UPDATE: (id) => `/${id}`,
  DELETE: (id) => `/${id}`,
  SINGLE: (id) => `/${id}`,
};
