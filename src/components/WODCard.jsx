import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import machinesData from '../data/machines.json';

const WODCard = () => {
  const { getTodaysWorkout } = useUser();
  const workout = getTodaysWorkout();

  if (!workout) return null;

  // Helper to find category for a machine
  const getMachineLink = (machineId) => {
    for (const [catId, catData] of Object.entries(machinesData)) {
      if (catData.machines[machineId]) {
        return `/machine/${catId}/${machineId}`;
      }
    }
    return '#';
  };

  return (
    <div className="bg-gradient-to-br from-orange-900/50 to-black border border-orange-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg className="w-32 h-32 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86l-1.43-1.43L22 16.29l-1.43-1.43L20.57 14.86z" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Today's Workout
          </span>
          <span className="text-gray-400 text-sm font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{workout.title}</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-md">{workout.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {workout.machines.map((machineId) => (
            <Link
              key={machineId}
              to={getMachineLink(machineId)}
              className="bg-black/40 border border-gray-700 rounded-lg p-3 text-center hover:border-orange-500 transition-colors"
            >
              <span className="text-xs text-gray-300 block truncate">
                {machineId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WODCard;
