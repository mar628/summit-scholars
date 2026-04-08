import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { feeActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FEE_LIST, STUDENT_FEE_LIST } from '@/redux/fees/constant';
import _ from 'lodash';

const validateSchema = Yup.object({
  title: Yup.string().min(2).max(100).required('Title is required'),
  amount: Yup.number().min(0).required('Amount is required'),
  dueDate: Yup.date().required('Due date is required'),
  month: Yup.string().max(20).optional(),
  description: Yup.string().max(300).optional(),
});

const FeeFormModal = ({ isOpen, onClose, editFee = null, prefillStudentId = null, prefillStudentName = null }) => {
  const dispatch = useDispatch();
  const { feesList, studentFeesList } = useSelector((s) => s.feeState);
  const { createFeeAction, updateFeeAction } = feeActions;
  const isEdit = !!editFee;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: editFee?.title || '',
      amount: editFee?.amount ?? '',
      dueDate: editFee?.dueDate ? new Date(editFee.dueDate).toISOString().split('T')[0] : '',
      month: editFee?.month || '',
      description: editFee?.description || '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const payload = {
        title: values.title,
        amount: Number(values.amount),
        dueDate: values.dueDate,
        month: values.month || '',
        description: values.description || '',
      };

      if (isEdit) {
        const res = await updateFeeAction(editFee._id, payload);
        if (res[0] === true) {
          const updateInList = (list) =>
            Array.isArray(list) ? _.cloneDeep(list).map((f) => (f._id === editFee._id ? res[1]?.data : f)) : list;
          dispatch({ type: FEE_LIST.update, payload: updateInList(feesList) });
          dispatch({ type: STUDENT_FEE_LIST.update, payload: updateInList(studentFeesList) });
          toast.success('Fee updated successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(res[1]?.message || 'Failed to update fee');
        }
      } else {
        if (!prefillStudentId) {
          toast.error('Please select a student first');
          setSubmitting(false);
          return;
        }
        const res = await createFeeAction({ ...payload, studentId: prefillStudentId });
        if (res[2] === 201) {
          const updated = Array.isArray(feesList) ? [res[1]?.data, ..._.cloneDeep(feesList)] : [res[1]?.data];
          const updatedStudent = Array.isArray(studentFeesList) ? [res[1]?.data, ..._.cloneDeep(studentFeesList)] : [res[1]?.data];
          dispatch({ type: FEE_LIST.update, payload: updated });
          dispatch({ type: STUDENT_FEE_LIST.update, payload: updatedStudent });
          toast.success('Fee created successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(res[1]?.message || 'Failed to create fee');
        }
      }
      setSubmitting(false);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } = formik;

  const modalTitle = isEdit
    ? 'Edit Fee Record'
    : prefillStudentName
    ? `Add Fee — ${prefillStudentName}`
    : 'Add Fee Record';

  return (
    <ModalV1
      isOpen={isOpen}
      onClose={() => { onClose(); resetForm(); }}
      title={modalTitle}
      size="small"
      maxHeight="fit-content"
    >
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="title" className="text-sm font-medium">Fee Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Monthly Tuition Fee"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.title && touched.title ? 'border-red-500' : ''}
            readOnly={isSubmitting}
          />
          {touched.title && errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="amount" className="text-sm font-medium">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.amount && touched.amount ? 'border-red-500' : ''}
              readOnly={isSubmitting}
            />
            {touched.amount && errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="dueDate" className="text-sm font-medium">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={values.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.dueDate && touched.dueDate ? 'border-red-500' : ''}
              readOnly={isSubmitting}
            />
            {touched.dueDate && errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="month" className="text-sm font-medium">Month / Period</Label>
          <Input
            id="month"
            placeholder="e.g. April 2026"
            value={values.month}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <textarea
            id="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            placeholder="Optional note"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => { resetForm(); onClose(); }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Save Changes' : 'Create Fee'
            )}
          </Button>
        </div>
      </form>
    </ModalV1>
  );
};

export default memo(FeeFormModal);
