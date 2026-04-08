import { memo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Power, Loader2 } from 'lucide-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from '@/redux/combineActions';
import { BATCH_LIST } from '@/redux/batch/constant';
import toast from 'react-hot-toast';
import _ from 'lodash';
import AddNewBatch from './AddNewBatch';

const BatchCard = ({ batch }) => {
  const dispatch = useDispatch();
  const { batchesList } = useSelector((s) => s.batchState);
  const { toggleBatchStatusAction, deleteBatchAction } = batchActions;

  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    const res = await toggleBatchStatusAction(batch._id);
    if (res[0] === true) {
      // Server deactivates all others when activating one — refresh full list
      const updatedList = _.cloneDeep(batchesList || []).map((b) => {
        if (b._id === batch._id) return res[1]?.data;
        // If we just activated this batch, all others become inactive
        if (res[1]?.data?.isActive) return { ...b, isActive: false };
        return b;
      });
      dispatch({ type: BATCH_LIST.update, payload: updatedList });
      toast.success(res[1]?.message || 'Batch status updated');
    } else {
      toast.error(res[1]?.message || 'Failed to update batch status');
    }
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete batch "${batch?.name}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    const res = await deleteBatchAction(batch._id);
    if (res[0] === true) {
      dispatch({ type: BATCH_LIST.update, payload: (batchesList || []).filter((b) => b._id !== batch._id) });
      toast.success('Batch deleted');
    } else {
      toast.error(res[1]?.message || 'Failed to delete batch');
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow border-l-4 ${batch?.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold capitalize">{batch?.name}</CardTitle>
              <CardDescription className="mt-1">
                {moment(batch?.startDate).format('MMM D, YYYY')} — {moment(batch?.endDate).format('MMM D, YYYY')}
              </CardDescription>
            </div>
            <Badge variant={batch?.isActive ? 'default' : 'secondary'} className={batch?.isActive ? 'bg-green-600' : ''}>
              {batch?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Created By</p>
              <p className="capitalize">{batch?.createdBy?.name || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Updated By</p>
              <p className="capitalize">{batch?.updatedBy?.name || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Created At</p>
              <p>{moment(batch?.createdAt).format('MMM D, YYYY h:mm a')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Updated At</p>
              <p>{moment(batch?.updatedAt).format('MMM D, YYYY h:mm a')}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            {/* Toggle Active/Inactive */}
            <Button
              size="sm"
              variant={batch?.isActive ? 'outline' : 'default'}
              className={`flex-1 ${batch?.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              onClick={handleToggle}
              disabled={isToggling}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Power className="h-4 w-4 mr-1" />
              )}
              {isToggling ? 'Updating...' : batch?.isActive ? 'Deactivate' : 'Set Active'}
            </Button>

            {/* Edit */}
            <Button size="sm" variant="outline" className="px-3" onClick={() => setIsEditOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Delete */}
            <Button
              size="sm"
              variant="destructive"
              className="px-3"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <AddNewBatch
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editBatch={batch}
      />
    </>
  );
};

export default memo(BatchCard);
