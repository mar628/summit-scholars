import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { studentActions } from '@/redux/combineActions';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const headers = [
  { title: 'Summary', key: 'summary' },
  { title: 'Subject', key: 'subjectName' },
  { title: 'Chapter', key: 'chapterName' },
  { title: 'Progress', key: 'value' },
  { title: 'Time', key: 'time' },
  { title: 'Meet Link', key: 'meet' },
  { title: 'Attended', key: 'isPresent' },
];

const AttendanceList = () => {
  const { studentId } = useParams();
  const {
    getStudentEnrollmentListAction,
    getStudentAttendanceListAction,
    createLiveClassAction,
  } = studentActions;

  const dispatch = useDispatch();
  const { enrollmentsList, attendanceList } = useSelector((state) => state.studentState);

  const [info, setInfo] = useState({
    loading: true,
    limit: 20,
    currentPage: 1,
  });
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  useEffect(() => {
    if (studentId && (!enrollmentsList || enrollmentsList?._id !== studentId)) {
      dispatch(getStudentEnrollmentListAction(studentId));
    }
    if (studentId && (!attendanceList || attendanceList?._id !== studentId)) {
      fetchAttendance();
    }
  }, [studentId]);

  useEffect(() => {
    if (enrollmentsList?._id === studentId && attendanceList?._id === studentId) {
      setInfo((prev) => ({ ...prev, loading: false }));
    }
  }, [enrollmentsList, attendanceList]);

  const fetchAttendance = useCallback(
    (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(getStudentAttendanceListAction(studentId, query));
    },
    [studentId, info?.currentPage, info?.limit]
  );

  const paginationHandlerFunction = useCallback(
    (page) => {
      setInfo((prev) => ({ ...prev, currentPage: page, loading: true }));
      fetchAttendance({ currentPage: page });
    },
    [info?.currentPage]
  );

  const handleCreateLiveClass = useCallback(async () => {
    setIsCreatingClass(true);
    const response = await createLiveClassAction(studentId);
    if (response[2] === 201) {
      toast.success('Live class created! Meet link sent to student by email.');
      // Refresh attendance list to show the new entry
      setInfo((prev) => ({ ...prev, loading: true }));
      fetchAttendance();
    } else {
      toast.error(response[1]?.message || 'Failed to create live class');
    }
    setIsCreatingClass(false);
  }, [studentId]);

  return (
    <>
      <MetaData title="Attendance | Summit Scholars Hub" />

      {/* Create Live Class Button */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Attendance Records</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click "Create Live Class" to schedule a Google Meet session for this student
          </p>
        </div>
        <Button
          onClick={handleCreateLiveClass}
          disabled={isCreatingClass}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isCreatingClass ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Create Live Class
            </>
          )}
        </Button>
      </div>

      <CustomTable1
        headers={headers}
        docs={attendanceList?.docs?.map((singleData) => ({
          ...singleData,
          subjectName: singleData?.subject?.name || '—',
          chapterName: singleData?.progress?.chapter?.title || '—',
          value: (singleData?.progress?.value || 0) + '%',
          isPresent: singleData?.isPresent ? (
            <Badge className="bg-green-600">Present</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Absent</Badge>
          ),
          time: moment(singleData?.startDate).format('LLL'),
          meet: singleData?.googleMeet?.meetLink ? (
            <a
              href={singleData?.googleMeet?.meetLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
            >
              <Video className="h-3.5 w-3.5" />
              Join Meet
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-muted-foreground text-xs">No link</span>
          ),
        }))}
        cardTitle="Attendance Data"
        loading={info?.loading}
        totalPages={attendanceList?.totalPages}
        currentPage={attendanceList?.currentPage}
        onPageChange={(page) => paginationHandlerFunction(page)}
        limit={info?.limit}
      />
    </>
  );
};

export default memo(AttendanceList);
