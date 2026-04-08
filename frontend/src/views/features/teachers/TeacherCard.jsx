import { memo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Phone, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { teacherActions } from '@/redux/combineActions';
import { TEACHER_LIST } from '@/redux/teachers/constant';
import toast from 'react-hot-toast';
import _ from 'lodash';
import TeacherFormModal from './TeacherFormModal';

const TeacherCard = ({ teacher }) => {
  const dispatch = useDispatch();
  const { teachersList } = useSelector((state) => state.teacherState);
  const { deleteTeacherAction } = teacherActions;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${teacher?.name}?`)) return;
    setIsDeleting(true);
    const response = await deleteTeacherAction(teacher._id);
    if (response[0] === true) {
      const updated = _.cloneDeep(teachersList || []).filter((t) => t._id !== teacher._id);
      dispatch({ type: TEACHER_LIST.update, payload: updated });
      toast.success('Teacher deleted successfully');
    } else {
      toast.error(response[1]?.message || 'Failed to delete teacher');
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold capitalize">{teacher?.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{teacher?.email}</CardDescription>
            </div>
            <Badge variant={teacher?.isActive ? 'default' : 'secondary'}>
              {teacher?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-foreground">{teacher?.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{teacher?.qualification} &bull; {teacher?.experience} yr{teacher?.experience !== 1 ? 's' : ''} exp</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{teacher?.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{teacher?.address}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Joined: {moment(teacher?.joiningDate).format('MMM D, YYYY')}
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TeacherFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editTeacher={teacher}
      />
    </>
  );
};

export default memo(TeacherCard);
