import { useEffect, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { teachingProgressActions, studentActions } from '@/redux/combineActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardList, BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'moment';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'Dashboard', href: null }];

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <Card>
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </CardContent>
  </Card>
);

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { profileDetails } = useSelector((s) => s.userProfileState);
  const { progressList, loading } = useSelector((s) => s.teachingProgressState);
  const { homeworkList } = useSelector((s) => s.studentState);
  const { getMyProgressAction } = teachingProgressActions;
  const { getStudentHomeworkListAction } = studentActions;

  useEffect(() => {
    dispatch(getMyProgressAction());
    dispatch(getStudentHomeworkListAction());
  }, []);

  const completedSessions = (progressList || []).filter((p) => p.status === 'completed').length;
  const totalMinutes = (progressList || []).reduce((s, p) => s + (p.duration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60);
  const recentProgress = (progressList || []).slice(0, 5);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Teacher Dashboard | Summit Scholars Hub" />
      <div className="container py-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold capitalize">Welcome, {profileDetails?.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profileDetails?.subject} Teacher &bull; {moment().format('dddd, MMMM D YYYY')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Sessions Taught" value={completedSessions}
              icon={BarChart3} color="bg-blue-100 text-blue-600"
              sub={`${totalHours} total hours`} />
            <StatCard title="Total Logs" value={(progressList || []).length}
              icon={ClipboardList} color="bg-purple-100 text-purple-600" />
            <StatCard title="Homework Assigned" value={homeworkList?.totalDocs || 0}
              icon={BookOpen} color="bg-green-100 text-green-600" />
            <StatCard title="Subject" value={profileDetails?.subject || '—'}
              icon={TrendingUp} color="bg-orange-100 text-orange-600"
              sub={`${profileDetails?.experience || 0} yrs exp`} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Recent Teaching Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recentProgress.length > 0 ? (
                <div className="space-y-3">
                  {recentProgress.map((p) => (
                    <div key={p._id} className="flex items-start justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.topic} &bull; Class {p.classLevel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{moment(p.date).format('DD MMM')}</p>
                        <p className="text-xs">{p.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No sessions logged yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Name', value: profileDetails?.name },
                { label: 'Email', value: profileDetails?.email },
                { label: 'Subject', value: profileDetails?.subject },
                { label: 'Qualification', value: profileDetails?.qualification },
                { label: 'Experience', value: `${profileDetails?.experience || 0} years` },
                { label: 'Joined', value: moment(profileDetails?.dateOfJoining).format('DD MMM YYYY') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium capitalize">{value || '—'}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainWrapper>
  );
};

export default memo(TeacherDashboard);
