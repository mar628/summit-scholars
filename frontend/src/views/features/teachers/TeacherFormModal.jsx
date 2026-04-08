import React, { memo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { teacherActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { TEACHER_LIST } from '@/redux/teachers/constant';
import _ from 'lodash';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const TeacherFormModal = ({ isOpen, onClose, editTeacher = null }) => {
  const dispatch = useDispatch();
  const { teachersList } = useSelector((state) => state.teacherState);
  const { createTeacherAction, updateTeacherAction } = teacherActions;

  const isEdit = !!editTeacher;

  const validateSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Min 2 chars').max(100).required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().min(7).max(15).required('Phone is required'),
    subject: Yup.string().min(2).max(100).required('Subject is required'),
    qualification: Yup.string().min(2).max(200).required('Qualification is required'),
    experience: Yup.number().min(0).max(60).required('Experience is required'),
    gender: Yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
    address: Yup.string().min(5).max(300).required('Address is required'),
    joiningDate: Yup.date().optional(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editTeacher?.name || '',
      email: editTeacher?.email || '',
      phone: editTeacher?.phone || '',
      subject: editTeacher?.subject || '',
      qualification: editTeacher?.qualification || '',
      experience: editTeacher?.experience ?? '',
      gender: editTeacher?.gender || '',
      address: editTeacher?.address || '',
      joiningDate: editTeacher?.joiningDate
        ? new Date(editTeacher.joiningDate).toISOString().split('T')[0]
        : '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const payload = { ...values, experience: Number(values.experience) };

      if (isEdit) {
        const response = await updateTeacherAction(editTeacher._id, payload);
        if (response[0] === true) {
          const updated = _.cloneDeep(teachersList || []).map((t) =>
            t._id === editTeacher._id ? response[1]?.data : t
          );
          dispatch({ type: TEACHER_LIST.update, payload: updated });
          toast.success('Teacher updated successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(response[1]?.message || 'Failed to update teacher');
        }
      } else {
        const response = await createTeacherAction(payload);
        if (response[2] === 201) {
          const updated = _.cloneDeep(teachersList || []);
          updated.unshift(response[1]?.data);
          dispatch({ type: TEACHER_LIST.update, payload: updated });
          toast.success('Teacher created successfully!');
          onClose();
          resetForm();
        } else {
          toast.error(response[1]?.message || 'Failed to create teacher');
        }
      }
      setSubmitting(false);
    },
  });

  const { errors, values, touched, handleChange, handleSubmit, handleBlur, isSubmitting, resetForm } = formik;

  const field = (id, label, type = 'text', required = true) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && '*'}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={values[id]}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors[id] && touched[id] ? 'border-red-500' : ''}
        readOnly={isSubmitting}
      />
      {touched[id] && errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <ModalV1
      isOpen={isOpen}
      onClose={() => { onClose(); resetForm(); }}
      title={isEdit ? 'Edit Teacher' : 'Add New Teacher'}
      size="medium"
      maxHeight="90vh"
    >
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('name', 'Full Name')}
          {field('email', 'Email', 'email')}
          {field('phone', 'Phone')}
          {field('subject', 'Subject Specialization')}
          {field('qualification', 'Qualification')}
          {field('experience', 'Experience (years)', 'number')}

          <div className="space-y-1">
            <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
            <select
              id="gender"
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                errors.gender && touched.gender ? 'border-red-500' : 'border-input'
              }`}
            >
              <option value="">Select gender</option>
              {genderOptions.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            {touched.gender && errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
          </div>

          {field('joiningDate', 'Joining Date', 'date', false)}
        </div>

        <div className="space-y-1">
          <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
          <textarea
            id="address"
            placeholder="Enter address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            readOnly={isSubmitting}
            className={`flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none ${
              errors.address && touched.address ? 'border-red-500' : 'border-input'
            }`}
          />
          {touched.address && errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEdit ? 'Updating...' : 'Creating...'}</>
            ) : (
              isEdit ? 'Update Teacher' : 'Add Teacher'
            )}
          </Button>
        </div>
      </form>
    </ModalV1>
  );
};

export default memo(TeacherFormModal);
