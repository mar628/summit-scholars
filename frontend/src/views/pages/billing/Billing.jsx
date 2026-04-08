import { useEffect, useState, memo, useMemo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { feeActions, studentActions } from '@/redux/combineActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import FeeCard from '@/views/features/fees/FeeCard';
import FeeSummaryBar from '@/views/features/fees/FeeSummaryBar';
import FeeFormModal from '@/views/features/fees/FeeFormModal';
import { Skeleton } from '@/components/ui/skeleton';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'Billing', href: null }];
const statusOptions = ['all', 'pending', 'paid', 'overdue', 'cancelled'];

const Billing = () => {
  const dispatch = useDispatch();
  const { feesList, loading } = useSelector((s) => s.feeState);
  const { studentsList } = useSelector((s) => s.studentState);
  const { getFeesListAction } = feeActions;
  const { getStudentsListAction } = studentActions;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    dispatch(getFeesListAction());
    if (!studentsList) {
      dispatch(getStudentsListAction());
    }
  }, []);

  const filtered = useMemo(() => {
    let list = Array.isArray(feesList) ? feesList : [];
    if (statusFilter !== 'all') {
      list = list.filter((f) => f.status === statusFilter);
    }
    if (selectedStudentId) {
      list = list.filter(
        (f) => f.studentId?._id === selectedStudentId || f.studentId === selectedStudentId
      );
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.title?.toLowerCase().includes(s) ||
          f.studentId?.name?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [feesList, statusFilter, selectedStudentId, search]);

  const selectedStudentName = useMemo(() => {
    if (!selectedStudentId || !studentsList) return null;
    return studentsList.find((s) => s._id === selectedStudentId)?.name || null;
  }, [selectedStudentId, studentsList]);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Billing | Summit Scholars Hub" />
      <div className="container py-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h1 className="text-2xl font-bold">Billing &amp; Fees</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fee Record
          </Button>
        </div>

        <FeeSummaryBar fees={Array.isArray(feesList) ? feesList : []} />

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            placeholder="Search by title or student..."
            className="w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Students</option>
            {Array.isArray(studentsList) &&
              studentsList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((fee) => (
              <FeeCard key={fee._id} fee={fee} isAdminView={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">No fee records found</p>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Fee Record
            </Button>
          </div>
        )}
      </div>

      <FeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefillStudentId={selectedStudentId || null}
        prefillStudentName={selectedStudentName}
      />
    </MainWrapper>
  );
};

export default memo(Billing);
