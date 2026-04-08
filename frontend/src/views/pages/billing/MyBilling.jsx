import { useEffect, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { feeActions } from '@/redux/combineActions';
import FeeCard from '@/views/features/fees/FeeCard';
import FeeSummaryBar from '@/views/features/fees/FeeSummaryBar';
import { Skeleton } from '@/components/ui/skeleton';
import MetaData from '@/utils/MetaData';
import { Receipt } from 'lucide-react';

const breadCrumbs = [{ label: 'My Billing', href: null }];

const MyBilling = () => {
  const dispatch = useDispatch();
  const { studentFeesList, loading } = useSelector((s) => s.feeState);
  const { getMyFeesAction } = feeActions;

  useEffect(() => {
    dispatch(getMyFeesAction());
  }, []);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="My Billing | Summit Scholars Hub" />
      <div className="container py-2">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="h-6 w-6" />
          <h1 className="text-2xl font-bold">My Fee Statements</h1>
        </div>

        <FeeSummaryBar fees={studentFeesList || []} />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : (studentFeesList || []).length > 0 ? (
          <div className="space-y-3">
            {studentFeesList.map((fee) => (
              <FeeCard key={fee._id} fee={fee} isAdminView={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg">
            <Receipt className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No fee records found</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};
export default memo(MyBilling);
