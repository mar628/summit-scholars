import { useState, memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import TeacherCard from './TeacherCard';
import TeacherSkeleton from './TeacherSkeleton';
import TeacherFormModal from './TeacherFormModal';
import { useSelector } from 'react-redux';

const TeachersList = ({ info, setInfo }) => {
  const { loading, teachersList } = useSelector((state) => state.teacherState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTeachers = useMemo(() => {
    return teachersList?.filter(
      (t) =>
        t?.name?.toLowerCase().includes(info?.searchTerm?.toLowerCase()) ||
        t?.subject?.toLowerCase().includes(info?.searchTerm?.toLowerCase()) ||
        t?.email?.toLowerCase().includes(info?.searchTerm?.toLowerCase())
    );
  }, [info?.searchTerm, teachersList]);

  const handleSearchChange = useCallback(
    (e) => setInfo((prev) => ({ ...prev, searchTerm: e?.target?.value || '' })),
    [setInfo]
  );

  return (
    <div className="container py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search by name, subject, email..."
            className="w-full md:w-72"
            value={info?.searchTerm}
            onChange={handleSearchChange}
          />
          <Button className="whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button>
        </div>
      </div>

      {loading ? (
        <TeacherSkeleton />
      ) : filteredTeachers?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <TeacherCard teacher={teacher} key={teacher._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {info?.searchTerm ? 'No matching teachers found' : 'No teachers added yet'}
          </p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Teacher
          </Button>
        </div>
      )}

      <TeacherFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default memo(TeachersList);
