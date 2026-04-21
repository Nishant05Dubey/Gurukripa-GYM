import { useState } from 'react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const WorkoutLogger = ({ machineId, machineName }) => {
  const { logSet, startRestTimer } = useUser();
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || !reps) return;

    logSet(machineId, weight, reps);
    
    // Start Rest Timer (60s)
    startRestTimer(60);

    // Feedback
    toast.success('Set Logged! Rest for 60s ⏱️', {
      duration: 3000,
      icon: '🔥',
    });
    
    setWeight('');
    setReps('');
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📝</span> Log Set
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!weight || !reps}
          className="bg-orange-600 text-white p-4 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default WorkoutLogger;
