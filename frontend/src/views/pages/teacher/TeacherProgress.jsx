import { useEffect, memo, useState, useCallback, useMemo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { teachingProgressActions } from '@/redux/combineActions';
import { PROGRESS_LIST } from '@/redux/teachingProgress/constant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ModalV1 from '@/views/components/modal/ModalV1';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Pencil, Trash2, Loader2, Calendar, Clock, Users } from 'lucide-react';
import moment from 'moment';
import toast from 'react-hot-toast';
import _ from 'lodash';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'Teaching Progress', href: null }];

const statusColors = { completed: 'default', planned: 'secondary', cancelled: 'destructive' };

const schema = Yup.object({
  title: Yup.string().min(2).max(100).required('Title is required'),
  subject: Yup.string().min(2).required('Subject is required'),
  topic: Yup.string().min(2).required('Topic is required'),
  classLevel: Yup.number().min(1).max(12).required('Class is required'),
  date: Yup.date().required('Date is required'),
  duration: Yup.number().min(1).required('Duration is required'),
  studentCount: Yup.number().min(0).optional(),
  status: Yup.string().oneOf(['completed', 'planned', 'cancelled']).required(),
  notes: Yup.string().max(500).optional(),
  description: Yup.string().max(300).optional(),
});

const ProgressModal = memo(({ isOpen, onClose, editEntry, profileDetails }) => {
  const dispatch = useDispatch();
  const { progressList } = useSelector((s) => s.teachingProgressState);
  const { createProgressAction, updateProgressAction } = teachingProgressActions;
  const isEdit = !!editEntry;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: editEntry?.title || '',
      subject: editEntry?.subject || profileDetails?.subject || '',
      topic: editEntry?.topic || '',
      classLevel: editEntry?.classLevel || '',
      date: editEntry?.date ? new Date(editEntry.date).toISOString().split('T')[0] : moment().format('YYYY-MM-DD'),
      duration: editEntry?.duration || 60,
      studentCount: editEntry?.studentCount || 0,
      status: editEntry?.status || 'completed',
      notes: editEntry?.notes || '',
      description: editEntry?.description || '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      const payload = { ...values, classLevel: Number(values.classLevel), duration: Number(values.duration), studentCount: Number(values.studentCount) };

      if (isEdit) {
        const res = await updateProgressAction(editEntry._id, payload);
        if (res[0] === true) {
          dispatch({ type: PROGRESS_LIST.update, payload: _.cloneDeep(progressList || []).map((p) => p._id === editEntry._id ? res[1]?.data : p) });
          toast.success('Progress updated!');
          onClose(); resetForm();
        } else toast.error(res[1]?.message || 'Failed');
      } else {
        const res = await createProgressAction(payload);
        if (res[2] === 201) {
          dispatch({ type: PROGRESS_LIST.update, payload: [res[1]?.data, ..._.cloneDeep(progressList || [])] });
          toast.success('Session logged!');
          onClose(); resetForm();
        } else toast.error(res[1]?.message || 'Failed');
      }
      setSubmitting(false);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } = formik;

  return (
    <ModalV1 isOpen={isOpen} onClose={() => { onClose(); resetForm(); }}
      title={isEdit ? 'Edit Session' : 'Log Teaching Session'} size="medium" maxHeight="90vh">
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'title', label: 'Session Title' },
            { id: 'subject', label: 'Subject' },
            { id: 'topic', label: 'Topic Covered' },
            { id: 'classLevel', label: 'Class Level', type: 'number' },
            { id: 'date', label: 'Date', type: 'date' },
            { id: 'duration', label: 'Duration (minutes)', type: 'number' },
            { id: 'studentCount', label: 'Students Present', type: 'number' },
          ].map(({ id, label, type = 'text' }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id} className="text-sm font-medium">{label} {id !== 'studentCount' && '*'}</Label>
              <Input id={id} type={type} value={values[id]} onChange={handleChange} onBlur={handleBlur}
                className={errors[id] && touched[id] ? 'border-red-500' : ''} readOnly={isSubmitting} />
              {touched[id] && errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
            <select id="status" value={values.status} onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <textarea id="description" value={values.description} onChange={handleChange} onBlur={handleBlur}
            rows={2} placeholder="Brief description" readOnly={isSubmitting}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes" className="text-sm font-medium">Notes / Observations</Label>
          <textarea id="notes" value={values.notes} onChange={handleChange} onBlur={handleBlur}
            rows={3} placeholder="Any observations, what went well, what to improve..." readOnly={isSubmitting}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEdit ? 'Saving...' : 'Logging...'}</> : isEdit ? 'Save Changes' : 'Log Session'}
          </Button>
        </div>
      </form>
    </ModalV1>
  );
});

const TeacherProgress = () => {
  const dispatch = useDispatch();
  const { progressList, loading } = useSelector((s) => s.teachingProgressState);
  const { profileDetails } = useSelector((s) => s.userProfileState);
  const { getMyProgressAction, deleteProgressAction } = teachingProgressActions;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(getMyProgressAction()); }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this session log?')) return;
    const res = await deleteProgressAction(id);
    if (res[0] === true) {
      dispatch({ type: PROGRESS_LIST.update, payload: (progressList || []).filter((p) => p._id !== id) });
      toast.success('Deleted');
    } else toast.error('Failed to delete');
  }, [progressList]);

  const filtered = useMemo(() => {
    if (!search.trim()) return progressList || [];
    const s = search.toLowerCase();
    return (progressList || []).filter((p) =>
      p.title?.toLowerCase().includes(s) || p.topic?.toLowerCase().includes(s) || p.subject?.toLowerCase().includes(s)
    );
  }, [progressList, search]);

  const totalHours = Math.round((progressList || []).reduce((s, p) => s + (p.duration || 0), 0) / 60);
  const completed = (progressList || []).filter((p) => p.status === 'completed').length;

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Teaching Progress | Summit Scholars Hub" />
      <div className="container py-2 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Teaching Progress</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {completed} sessions completed &bull; {totalHours} total hours
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Input placeholder="Search sessions..." className="w-full md:w-64"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={() => { setEditEntry(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Log Session
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((p) => (
              <Card key={p._id} className={`border-l-4 ${p.status === 'completed' ? 'border-l-green-500' : p.status === 'planned' ? 'border-l-blue-400' : 'border-l-red-400'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{p.title}</p>
                        <Badge variant={statusColors[p.status] || 'secondary'} className="capitalize text-xs">{p.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{p.subject} &bull; <span className="font-medium text-foreground">{p.topic}</span> &bull; Class {p.classLevel}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{moment(p.date).format('DD MMM YYYY')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration} min</span>
                        {p.studentCount > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.studentCount} students</span>}
                      </div>
                      {p.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{p.notes}"</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button size="sm" variant="outline" className="h-8 px-2"
                        onClick={() => { setEditEntry(p); setIsModalOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 px-2"
                        onClick={() => handleDelete(p._id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">{search ? 'No matching sessions' : 'No sessions logged yet'}</p>
            <Button variant="outline" onClick={() => { setEditEntry(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Log First Session
            </Button>
          </div>
        )}
      </div>

      <ProgressModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditEntry(null); }}
        editEntry={editEntry}
        profileDetails={profileDetails}
      />
    </MainWrapper>
  );
};

export default memo(TeacherProgress);
