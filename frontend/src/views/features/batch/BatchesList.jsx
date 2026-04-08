import { useState, memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import BatchCard from './BatchCard';
import BatchSkeleton from './BatchSkeleton';
import AddNewBatch from './AddNewBatch';
import { useSelector } from 'react-redux';

const BatchesList = ({ info, setInfo }) => {
  const { loading, batchesList } = useSelector((state) => state.batchState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBatches = useMemo(() => {
    return batchesList?.filter((singleBatch) =>
      singleBatch?.name?.toLowerCase().includes(info?.searchTerm?.toLowerCase())
    );
  }, [info?.searchTerm, batchesList]);

  const filterBatchListHandleChange = useCallback(
    (e) => {
      setInfo((prev) => ({ ...prev, searchTerm: e?.target?.value || '' }));
    },
    [setInfo]
  );

  return (
    <div className="container py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Batches</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search batch..."
            className="w-full md:w-64"
            value={info?.searchTerm}
            onChange={filterBatchListHandleChange}
          />
          <Button className="whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Batch
          </Button>
        </div>
      </div>

      {loading ? (
        <BatchSkeleton />
      ) : filteredBatches?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBatches?.map((singleBatch) => (
            <BatchCard batch={singleBatch} key={singleBatch?._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {info?.searchTerm ? 'No matching batches found' : 'No batches available yet'}
          </p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Batch
          </Button>
        </div>
      )}

      <AddNewBatch isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default memo(BatchesList);
