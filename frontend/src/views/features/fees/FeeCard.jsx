import { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle, Calendar, IndianRupee } from 'lucide-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { feeActions } from '@/redux/combineActions';
import { FEE_LIST, STUDENT_FEE_LIST } from '@/redux/fees/constant';
import toast from 'react-hot-toast';
import _ from 'lodash';
import FeeFormModal from './FeeFormModal';

const statusColors = {
  paid: 'default',
  pending: 'secondary',
  overdue: 'destructive',
  cancelled: 'outline',
};

const FeeCard = ({ fee, isAdminView = true }) => {
  const dispatch = useDispatch();
  const { feesList, studentFeesList } = useSelector((s) => s.feeState);
  const { updateFeeAction, deleteFeeAction } = feeActions;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const markPaid = async () => {
    setIsMarkingPaid(true);
    const res = await updateFeeAction(fee._id, { status: 'paid', paidDate: new Date() });
    if (res[0] === true) {
      const updateList = (list) => list ? _.cloneDeep(list).map((f) => f._id === fee._id ? res[1]?.data : f) : list;
      dispatch({ type: FEE_LIST.update, payload: updateList(feesList) });
      dispatch({ type: STUDENT_FEE_LIST.update, payload: updateList(studentFeesList) });
      toast.success('Marked as paid!');
    } else {
      toast.error(res[1]?.message || 'Failed');
    }
    setIsMarkingPaid(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this fee record?')) return;
    setIsDeleting(true);
    const res = await deleteFeeAction(fee._id);
    if (res[0] === true) {
      const filterList = (list) => list ? _.cloneDeep(list).filter((f) => f._id !== fee._id) : list;
      dispatch({ type: FEE_LIST.update, payload: filterList(feesList) });
      dispatch({ type: STUDENT_FEE_LIST.update, payload: filterList(studentFeesList) });
      toast.success('Fee deleted');
    } else {
      toast.error(res[1]?.message || 'Failed');
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className={`border-l-4 ${fee.status === 'paid' ? 'border-l-green-500' : fee.status === 'overdue' ? 'border-l-red-500' : 'border-l-yellow-400'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm truncate">{fee.title}</p>
                {fee.month && <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{fee.month}</span>}
                <Badge variant={statusColors[fee.status] || 'secondary'} className="text-xs capitalize">{fee.status}</Badge>
              </div>
              {isAdminView && fee.studentId && (
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{fee.studentId?.name}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 font-bold text-base">
                  <IndianRupee className="h-4 w-4" />
                  {fee.amount?.toLocaleString('en-IN')}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  Due: {moment(fee.dueDate).format('DD MMM YYYY')}
                </span>
                {fee.paidDate && (
                  <span className="text-xs text-green-600">Paid: {moment(fee.paidDate).format('DD MMM YYYY')}</span>
                )}
              </div>
              {fee.description && <p className="text-xs text-muted-foreground mt-1">{fee.description}</p>}
            </div>

            {isAdminView && (
              <div className="flex gap-1 flex-shrink-0">
                {fee.status !== 'paid' && fee.status !== 'cancelled' && (
                  <Button size="sm" variant="outline" className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={markPaid} disabled={isMarkingPaid}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setIsEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8 px-2" onClick={handleDelete} disabled={isDeleting}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isAdminView && (
        <FeeFormModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} editFee={fee} />
      )}
    </>
  );
};
export default memo(FeeCard);
