import { memo, useState } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Service from '@/services';
import { getAccessToken } from '@/helpers/local-storage';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [
  { label: 'Teachers', href: '/admin/teachers' },
  { label: 'Register Teacher', href: null },
];

const schema = Yup.object({
  name: Yup.string().min(2).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must have uppercase')
    .matches(/[a-z]/, 'Must have lowercase')
    .matches(/[0-9]/, 'Must have number')
    .matches(/[@$!%*?&#]/, 'Must have special character')
    .required('Password is required'),
  phone: Yup.string().min(7).required('Phone is required'),
  gender: Yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  address: Yup.string().min(5).required('Address is required'),
  subject: Yup.string().min(2).required('Subject is required'),
  qualification: Yup.string().min(2).required('Qualification is required'),
  experience: Yup.number().min(0).required('Experience is required'),
});

const RegisterTeacher = () => {
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '', email: '', password: '', phone: '',
      gender: '', address: '', subject: '', qualification: '', experience: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const token = getAccessToken();
      const res = await Service.fetchPost('/user/register-teacher', {
        ...values,
        experience: Number(values.experience),
      }, token);

      if (res[2] === 201) {
        toast.success(`Teacher account created for ${values.name}!`);
        setSuccess(true);
        resetForm();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(res[1]?.message || 'Failed to register teacher');
      }
      setSubmitting(false);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } = formik;

  const renderField = (id, label, type = 'text', required = true) => (
    <div className="space-y-1" key={id}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && ' *'}
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
      {touched[id] && errors[id] && (
        <p className="text-xs text-red-500">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Register Teacher | Summit Scholars Hub" />
      <div className="container py-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Register New Teacher</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create a login account for a teacher. They log in at the same login page.
            </p>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✅ Teacher account created! They can now log in with their email and password.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('name', 'Full Name')}
                {renderField('email', 'Email', 'email')}
                {renderField('password', 'Password', 'password')}
                {renderField('phone', 'Phone Number')}
                {renderField('subject', 'Subject Specialization')}
                {renderField('qualification', 'Qualification')}
                {renderField('experience', 'Experience (years)', 'number')}

                <div className="space-y-1">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                  <select
                    id="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                      errors.gender && touched.gender ? 'border-red-500' : 'border-input'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {touched.gender && errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                <textarea
                  id="address"
                  rows={2}
                  placeholder="Enter address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={isSubmitting}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                {touched.address && errors.address && (
                  <p className="text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</>
                  ) : (
                    'Register Teacher'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainWrapper>
  );
};

export default memo(RegisterTeacher);
