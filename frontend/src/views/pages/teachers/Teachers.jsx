import React, { useEffect, useCallback, memo, useState } from 'react';
import MainWrapper from '../../layouts/Mainwrapper';
import TeachersList from '../../features/teachers/TeachersList';
import { useSelector, useDispatch } from 'react-redux';
import { teacherActions } from '@/redux/combineActions';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'Teachers', href: null }];

const Teachers = () => {
  const { getTeachersListAction } = teacherActions;
  const dispatch = useDispatch();
  const { teachersList } = useSelector((state) => state.teacherState);

  const [info, setInfo] = useState({ searchTerm: '' });

  useEffect(() => {
    if (!teachersList) {
      dispatch(getTeachersListAction());
    }
  }, []);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Teachers | Summit Scholars Hub" />
      <TeachersList info={info} setInfo={setInfo} />
    </MainWrapper>
  );
};

export default memo(Teachers);
