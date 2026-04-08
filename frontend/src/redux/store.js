import { configureStore } from '@reduxjs/toolkit';
import { LoginReducer } from './login/reducer';
import { UserProfileReducer } from './userProfile/reducer';
import { BatchReducer } from './batch/reducer';
import { BoardReducer } from './boards/reducer';
import { SubjectReducer } from './subjects/reducer';
import { StudentReducer } from './students/reducer';
import { GraphReducer } from './graphs/reducer';
import { ContactFormReducer } from './contact/reducer';
import { MyStudentDetailsReducer } from './myDetails/reducer';
import { builderReducerToolkit } from './builder/reducer';
import { TeacherReducer } from './teachers/reducer';
import { FeeReducer } from './fees/reducer';
import { TeachingProgressReducer } from './teachingProgress/reducer';

const reducer = {
  loginState: LoginReducer,
  userProfileState: UserProfileReducer,
  batchState: BatchReducer,
  boardState: BoardReducer,
  subjectState: SubjectReducer,
  studentState: StudentReducer,
  graphState: GraphReducer,
  contactFormState: ContactFormReducer,
  myDetailsState: MyStudentDetailsReducer,
  builderToolkitState: builderReducerToolkit,
  teacherState: TeacherReducer,
  feeState: FeeReducer,
  teachingProgressState: TeachingProgressReducer,
};

const store = configureStore({ reducer, preloadedState: {}, devTools: true });
export default store;
