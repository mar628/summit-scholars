import { useEffect, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { feeActions } from '@/redux/combineActions';
import FeeCard from '@/views/features/fees/FeeCard';
import FeeSummaryBar from '@/views/features/fees/FeeSummaryBar';
import FeeFormModal from '@/views/features/fees/FeeFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { STUDENT_FEE_LIST } from '@/redux/fees/constant';

const StudentFees = ({ studentId, studentName }) => {
  const dispatch = useDispatch();
  const { studentFeesList, loading } = useSelector((s) => s.feeState);
  const { getStudentFeesAction } = feeActions;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (studentId) dispatch(getStudentFeesAction(studentId));
    return () => dispatch({ type: STUDENT_FEE_LIST.update, payload: null });
  }, [studentId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fee Records</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Fee
        </Button>
      </div>

      <FeeSummaryBar fees={studentFeesList || []} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : (studentFeesList || []).length > 0 ? (
        <div className="space-y-3">
          {studentFeesList.map((fee) => (
            <FeeCard key={fee._id} fee={fee} isAdminView={true} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 border rounded-lg">
          <p className="text-muted-foreground mb-3">No fee records for this student</p>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />Add First Fee
          </Button>
        </div>
      )}

      <FeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefillStudentId={studentId}
        prefillStudentName={studentName}
      />
    </div>
  );
};
export default memo(StudentFees);
