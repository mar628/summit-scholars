import { memo } from 'react';
import { IndianRupee, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const FeeSummaryBar = ({ fees = [] }) => {
  const total = fees.reduce((s, f) => s + (f.amount || 0), 0);
  const paid = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const pending = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
  const overdue = fees.filter((f) => f.status === 'overdue').reduce((s, f) => s + f.amount, 0);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { label: 'Total Billed', value: fmt(total), icon: IndianRupee, color: 'text-blue-600 bg-blue-50' },
        { label: 'Paid', value: fmt(paid), icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        { label: 'Pending', value: fmt(pending), icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
        { label: 'Overdue', value: fmt(overdue), icon: AlertCircle, color: 'text-red-600 bg-red-50' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className={`rounded-lg p-3 ${color} flex items-center gap-3`}>
          <Icon className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium opacity-75">{label}</p>
            <p className="text-base font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default memo(FeeSummaryBar);
