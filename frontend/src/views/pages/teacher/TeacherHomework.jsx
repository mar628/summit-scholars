import { useEffect, useCallback, memo, useState } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { studentActions } from '@/redux/combineActions';
import moment from 'moment';
import { format } from 'timeago.js';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import { Button } from '@/components/ui/button';
import CreateHomework from '@/views/features/homework/CreateHomework';
import DeleteHomework from '@/views/features/homework/DeleteHomework';
import { Trash, Pencil, Plus } from 'lucide-react';

const breadCrumbs = [{ label: 'Homework', href: null }];

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Student', key: 'studentName' },
  { title: 'Deadline', key: 'deadline' },
  { title: 'Date', key: 'date' },
  { title: 'Time Ago', key: 'timeAgo' },
  { title: 'Rating', key: 'rating' },
];

const TeacherHomework = () => {
  const dispatch = useDispatch();
  const { homeworkList, loading } = useSelector((s) => s.studentState);
  const { getStudentHomeworkListAction } = studentActions;

  const [info, setInfo] = useState({
    limit: 10,
    currentPage: 1,
    openModal: false,
    deleteModal: false,
    isSubmitting: false,
    homeworkDetails: null,
    initialValues: {
      title: '',
      description: '',
      deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
    },
  });

  const fetchHomework = useCallback((queryObject = {}) => {
    dispatch(getStudentHomeworkListAction(queryObject));
  }, []);

  useEffect(() => {
    fetchHomework({ currentPage: info.currentPage });
  }, []);

  const closeModalFunction = useCallback(() => {
    setInfo((prev) => ({
      ...prev,
      openModal: false,
      deleteModal: false,
      isSubmitting: false,
      homeworkDetails: null,
      initialValues: {
        title: '',
        description: '',
        deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
      },
    }));
  }, []);

  const editHomeworkFunction = useCallback((row) => {
    setInfo((prev) => ({
      ...prev,
      homeworkDetails: row,
      openModal: true,
      feedbackRating: { rating: 4, feedback: '' },
      initialValues: {
        title: row?.title,
        description: row?.description,
        deadline: moment(row?.deadline).format('YYYY-MM-DD'),
      },
    }));
  }, []);

  const deleteHomeworkFunction = useCallback((row) => {
    setInfo((prev) => ({ ...prev, deleteModal: true, homeworkDetails: row }));
  }, []);

  const paginationFunctionHandler = useCallback((page) => {
    setInfo((prev) => ({ ...prev, currentPage: page }));
    fetchHomework({ currentPage: page });
  }, []);

  const docs = (homeworkList?.docs || []).map((hw) => ({
    ...hw,
    studentName: hw?.student?.name || '—',
    deadline: moment(hw?.deadline).format('LLL'),
    date: moment(hw?.createdAt).format('L'),
    timeAgo: format(hw?.createdAt),
  }));

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Teacher Homework | Summit Scholars Hub" />
      <div className="container py-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Homework Management</h1>
          <Button onClick={() => setInfo((p) => ({ ...p, openModal: true }))}>
            <Plus className="mr-2 h-4 w-4" /> Create Homework
          </Button>
        </div>

        <CustomTable1
          headers={headers}
          docs={docs}
          cardTitle="Homework List"
          loading={loading}
          totalPages={homeworkList?.totalPages}
          currentPage={homeworkList?.currentPage}
          onPageChange={paginationFunctionHandler}
          limit={info.limit}
          actions={(row) => (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => editHomeworkFunction(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteHomeworkFunction(row)}>
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        />

        <CreateHomework info={info} setInfo={setInfo} closeModalFunction={closeModalFunction} />
        <DeleteHomework info={info} closeModalFunction={closeModalFunction} />
      </div>
    </MainWrapper>
  );
};

export default memo(TeacherHomework);
