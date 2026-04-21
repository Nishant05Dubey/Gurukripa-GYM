import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const RestTimer = () => {
  const { restTimer, stopRestTimer, addRestTime } = useUser();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!restTimer.isActive) {
      setTimeLeft(0);
      return;
    }

    const endTime = restTimer.endTime;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((endTime - now) / 1000);
      
      if (remaining <= 0) {
        stopRestTimer();
        setTimeLeft(0);
        // Play sound?
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [restTimer, stopRestTimer]);

  if (!restTimer.isActive) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 border border-orange-500/50 rounded-2xl shadow-2xl p-4 w-48 backdrop-blur-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-bold uppercase">Rest Timer</span>
          <button 
            onClick={stopRestTimer}
            className="text-gray-500 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mb-3">
          <span className="text-4xl font-bold font-mono text-white tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => addRestTime(30)}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
          >
            +30s
          </button>
          <button 
            onClick={stopRestTimer}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;
