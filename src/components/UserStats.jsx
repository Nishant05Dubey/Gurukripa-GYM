import { useUser } from '../context/UserContext';

const UserStats = () => {
  const { userStats } = useUser();

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {/* Streak */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
        <div className="text-2xl mb-1">🔥</div>
        <div className="text-xl font-bold text-white">{userStats.streak}</div>
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Day Streak</div>
      </div>

      {/* Total Workouts */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
        <div className="text-2xl mb-1">💪</div>
        <div className="text-xl font-bold text-white">{userStats.totalWorkouts}</div>
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Workouts</div>
      </div>

      {/* Level */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
        <div className="text-2xl mb-1">🏆</div>
        <div className="text-xl font-bold text-orange-500">{userStats.level}</div>
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{userStats.xp} XP</div>
      </div>
    </div>
  );
};

export default UserStats;
