import { useUser } from '../context/UserContext';

const HistoryView = ({ machineId }) => {
  const { getMachineHistory } = useUser();
  const history = getMachineHistory(machineId);

  if (history.length === 0) return null;

  // Group by date (simple version)
  const lastSession = history[0]; // Most recent log

  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📜</span> History
        </h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
          {history.length} sets total
        </span>
      </div>

      <div className="space-y-3">
        {history.slice(0, 5).map((log) => (
          <div key={log.id} className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-400">
              {(() => {
                try {
                  const d = new Date(log.date);
                  return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                } catch (e) {
                  return 'Invalid Date';
                }
              })()}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-bold text-white">{log.weight} <span className="text-gray-600 text-xs font-normal">kg</span></span>
              <span className="font-bold text-orange-500">{log.reps} <span className="text-gray-600 text-xs font-normal">reps</span></span>
            </div>
          </div>
        ))}
      </div>
      
      {history.length > 5 && (
        <div className="text-center mt-3">
          <button className="text-xs text-gray-500 hover:text-white transition-colors">
            View All History
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
