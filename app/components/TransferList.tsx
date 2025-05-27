import { TransferItem } from '../types/budget';

interface TransferListProps {
  transfers: TransferItem[];
  onTransferComplete: (id: string, completed: boolean) => void;
}

export default function TransferList({ transfers, onTransferComplete }: TransferListProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">To do list</h2>
      
      <div className="space-y-4">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{transfer.description}</h3>
              <p className="text-2xl font-bold text-blue-600">£{transfer.amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={transfer.completed}
                onChange={(e) => onTransferComplete(transfer.id, e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                {transfer.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 