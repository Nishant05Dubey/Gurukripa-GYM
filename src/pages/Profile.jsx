import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import MaintenanceModal from '../components/MaintenanceModal';
import { useState } from 'react';

const Profile = () => {
  const { user, userStats, workoutLogs, logout, isAdmin, makeMeAdmin } = useUser();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Helper to get dates for calendar visualization
  const getWorkoutDates = () => {
    const dates = new Set();
    Object.values(workoutLogs).forEach(logs => {
      logs.forEach(log => {
        dates.add(new Date(log.date).toDateString());
      });
    });
    return dates;
  };

  const workoutDates = getWorkoutDates();

  // Generate last 30 days for calendar grid
  const getCalendarDays = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  // Flatten logs for history list
  const getAllLogs = () => {
    let allLogs = [];
    Object.entries(workoutLogs).forEach(([machineId, logs]) => {
      logs.forEach(log => {
        allLogs.push({ ...log, machineId });
      });
    });
    return allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const history = getAllLogs();

  return (
    <div className="min-h-screen bg-black text-white pb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 pt-12 text-center border-b border-gray-800">
        <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full mb-4 border-4 border-orange-500 flex items-center justify-center overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {user?.displayName || 'Guest User'}
        </h1>
        <div className="inline-block bg-gray-800 rounded-full px-3 py-1 text-xs font-bold text-orange-400 mb-4">
          {userStats.level} • {userStats.xp} XP
        </div>
        
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{userStats.totalWorkouts}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Workouts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{userStats.streak}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Calendar Heatmap */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Last 30 Days</h2>
          <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
            {calendarDays.map((date, i) => {
              const isWorkoutDay = workoutDates.has(date.toDateString());
              return (
                <div 
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${
                    isWorkoutDay ? 'bg-orange-500' : 'bg-gray-800'
                  }`}
                  title={date.toDateString()}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.slice(0, 10).map((log) => (
                <div key={log.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white capitalize">
                      {log.machineId.replace(/-/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.date).toLocaleDateString()} • {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-lg">
                      {log.weight}kg
                    </div>
                    <div className="text-xs text-gray-400">
                      {log.reps} Reps
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No workouts logged yet. Go lift something! 💪
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 text-center space-y-4">
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>💬</span> Send Feedback / Report Bug
          </button>

          <button 
            onClick={logout}
            className="text-red-500 hover:text-red-400 text-sm font-bold"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <MaintenanceModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />

      {/* Bottom Nav (Simple) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-gray-800 p-4 flex justify-around z-40">
        <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
          <span className="text-[10px] mt-1">Scan</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-orange-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] mt-1">Profile</span>
        </Link>
      </div>
      {isAdmin && (
        <div className="mt-8 text-center">
          <Link to="/admin" className="text-gray-600 text-xs hover:text-orange-500 transition-colors">
            Admin Dashboard
          </Link>
        </div>
      )}
      
      {/* Temporary Dev Button */}
      {!isAdmin && (
          <div className="mt-4 text-center opacity-10 hover:opacity-100 transition-opacity">
              <button onClick={makeMeAdmin} className="text-[10px] text-red-500">
                  (Dev: Become Admin)
              </button>
          </div>
      )}
    </div>
  );
};

export default Profile;
