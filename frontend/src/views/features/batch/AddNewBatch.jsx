import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { batchActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BATCH_LIST } from '@/redux/batch/constant';
import _ from 'lodash';

const AddNewBatch = ({ isOpen, onClose, editBatch = null }) => {
  const dispatch = useDispatch();
  const { batchesList } = useSelector((s) => s.batchState);
  const { createNewBatchAction, updateBatchAction } = batchActions;
  const isEdit = !!editBatch;

  const schema = Yup.object({
    name: Yup.string().min(2, 'Min 2 characters').max(50).required('Batch name is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required('End date is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editBatch?.name || '',
      startDate: editBatch?.startDate ? new Date(editBatch.startDate).toISOString().split('T')[0] : '',
      endDate: editBatch?.endDate ? new Date(editBatch.endDate).toISOString().split('T')[0] : '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      if (isEdit) {
        const res = await updateBatchAction(editBatch._id, values);
        if (res[0] === true) {
          const updated = _.cloneDeep(batchesList || []).map((b) =>
            b._id === editBatch._id ? res[1]?.data : b
          );
          dispatch({ type: BATCH_LIST.update, payload: updated });
          toast.success('Batch updated successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(res[1]?.message || 'Failed to update batch');
        }
      } else {
        const res = await createNewBatchAction(values);
        if (res[2] === 201) {
          const updated = _.cloneDeep(batchesList || []);
          updated.unshift(res[1]?.data);
          dispatch({ type: BATCH_LIST.update, payload: updated });
          toast.success('Batch created successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(res[1]?.message || 'Failed to create batch');
        }
      }
      setSubmitting(false);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } = formik;

  return (
    <ModalV1
      isOpen={isOpen}
      onClose={() => { onClose(); resetForm(); }}
      title={isEdit ? 'Edit Batch' : 'Create New Batch'}
      size="small"
      maxHeight="fit-content"
    >
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm font-medium">Batch Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Batch 2025-26"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? 'border-red-500' : ''}
            readOnly={isSubmitting}
          />
          {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.startDate && touched.startDate ? 'border-red-500' : ''}
            readOnly={isSubmitting}
          />
          {touched.startDate && errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.endDate && touched.endDate ? 'border-red-500' : ''}
            readOnly={isSubmitting}
          />
          {touched.endDate && errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" disabled={isSubmitting}
            onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEdit ? 'Saving...' : 'Creating...'}</>
            ) : (
              isEdit ? 'Save Changes' : 'Create Batch'
            )}
          </Button>
        </div>
      </form>
    </ModalV1>
  );
};

export default memo(AddNewBatch);
