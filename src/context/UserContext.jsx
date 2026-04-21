import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, googleProvider } from '../lib/firebase';
import workoutsData from '../data/workouts.json';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  // --- State ---
  // --- State ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lazy init to prevent overwriting localStorage on initial render
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('kgf_workout_logs');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error parsing logs", e);
      return {};
    }
  });

  const [userStats, setUserStats] = useState(() => {
    try {
      const saved = localStorage.getItem('kgf_user_stats');
      return saved ? JSON.parse(saved) : {
        streak: 0,
        totalWorkouts: 0,
        lastWorkoutDate: null,
        level: 'Beginner',
        xp: 0
      };
    } catch (e) {
      console.error("Error parsing stats", e);
      return {
        streak: 0,
        totalWorkouts: 0,
        lastWorkoutDate: null,
        level: 'Beginner',
        xp: 0
      };
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // --- Auth Listener ---
  useEffect(() => {
    // Local data is already loaded via lazy init
    setLoading(false); 

    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // 2. If Logged In, Try to Load Cloud Data
        await loadUserData(currentUser);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Data Loading ---
  const loadLocalData = () => {
    try {
      const savedLogs = localStorage.getItem('kgf_workout_logs');
      const savedStats = localStorage.getItem('kgf_user_stats');
      if (savedLogs) setWorkoutLogs(JSON.parse(savedLogs));
      if (savedStats) setUserStats(JSON.parse(savedStats));
    } catch (e) {
      console.error("Error loading local data", e);
    }
  };

  const loadUserData = async (currentUser) => {
    if (!db) return;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Merge strategy: Combine Cloud and Local data
        // This prevents losing data logged while offline/logged out
        
        // 1. Merge Stats (Take max values)
        setUserStats(prev => {
           const cloudStats = data.stats || {};
           return {
             ...prev,
             ...cloudStats,
             // If local has higher progress, keep local (optional, but safer to trust max)
             totalWorkouts: Math.max(prev.totalWorkouts || 0, cloudStats.totalWorkouts || 0),
             xp: Math.max(prev.xp || 0, cloudStats.xp || 0)
           };
        });

        // 2. Merge Logs (Concat and Dedupe)
        setWorkoutLogs(prev => {
            const cloudLogs = data.logs || {};
            const merged = { ...prev };
            
            Object.keys(cloudLogs).forEach(machineId => {
                const localMachineLogs = merged[machineId] || [];
                const cloudMachineLogs = cloudLogs[machineId] || [];
                
                // Combine and deduplicate by ID
                const combined = [...localMachineLogs, ...cloudMachineLogs];
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                
                // Sort by date desc
                unique.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                merged[machineId] = unique;
            });
            return merged;
        });

        if (data.isAdmin) setIsAdmin(true);
        
        // Also update profile info in background
        updateProfileInCloud(currentUser);
      } else {
        // New user? Sync local data to cloud
        await syncLocalToCloud(currentUser);
      }
    } catch (error) {
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        console.log("Network offline, using local data.");
      } else {
        console.error("Error loading user data:", error);
      }
    }
  };

  const updateProfileInCloud = async (currentUser) => {
    if (!db) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        email: currentUser.email,
        lastSeen: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Error updating profile", e);
    }
  };

  const syncLocalToCloud = async (currentUser) => {
    if (!db) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        stats: userStats,
        logs: workoutLogs,
        createdAt: new Date().toISOString(),
        isAdmin: false // Default to false
      }, { merge: true });
      console.log("☁️ Synced local data to cloud");
    } catch (error) {
      console.error("Error syncing to cloud:", error);
    }
  };

  // --- Persistence (Local + Cloud) ---
  useEffect(() => {
    // Always save to local as backup/offline cache
    localStorage.setItem('kgf_workout_logs', JSON.stringify(workoutLogs));
    localStorage.setItem('kgf_user_stats', JSON.stringify(userStats));

    // If logged in, save to cloud
    if (user && db) {
      const saveToCloud = async () => {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            stats: userStats,
            logs: workoutLogs,
            displayName: user.displayName, // Ensure these are always up to date
            photoURL: user.photoURL
          });
        } catch (error) {
          // If doc doesn't exist yet (race condition), set it
          await setDoc(doc(db, "users", user.uid), {
            stats: userStats,
            logs: workoutLogs
          }, { merge: true });
        }
      };
      // Debounce could be added here, but for now direct save is fine for low volume
      saveToCloud();
    }
  }, [workoutLogs, userStats, user]);

  // --- Actions ---

  const login = async () => {
    if (!auth) {
      alert("Firebase not configured. Please add API keys.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear state or revert to local? 
      // For now, let's revert to whatever is in local storage (which might be the same data)
      loadLocalData();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const logSet = (machineId, weight, reps) => {
    console.log('📝 logSet called:', { machineId, weight, reps });
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      reps: parseInt(reps)
    };

    // Update Logs
    setWorkoutLogs(prev => {
      console.log('🔄 Updating workoutLogs', prev);
      return {
        ...prev,
        [machineId]: [newLog, ...(prev[machineId] || [])]
      };
    });

    // Update Stats (Streak & XP)
    updateStats();
  };

  const updateStats = () => {
    setUserStats(prev => {
      const today = new Date().toDateString();
      const lastDate = prev.lastWorkoutDate ? new Date(prev.lastWorkoutDate).toDateString() : null;
      
      let newStreak = prev.streak;
      let newTotal = prev.totalWorkouts + 1;
      let newXP = prev.xp + 10;

      if (today !== lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastDate === null) {
            newStreak = 1;
        } else {
           newStreak = 1;
        }
      }

      let newLevel = 'Beginner';
      if (newXP > 100) newLevel = 'Regular';
      if (newXP > 500) newLevel = 'Dedicated';
      if (newXP > 1000) newLevel = 'Beast';
      if (newXP > 5000) newLevel = 'Legend';

      return {
        ...prev,
        streak: newStreak,
        totalWorkouts: newTotal,
        lastWorkoutDate: new Date().toISOString(),
        level: newLevel,
        xp: newXP
      };
    });
  };

  const getMachineHistory = (machineId) => {
    return workoutLogs[machineId] || [];
  };

  const getTodaysWorkout = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    return workoutsData[todayName];
  };

  // --- Rest Timer State ---
  const [restTimer, setRestTimer] = useState({
    isActive: false,
    endTime: null
  });

  const startRestTimer = (durationSeconds = 60) => {
    const endTime = Date.now() + (durationSeconds * 1000);
    setRestTimer({
      isActive: true,
      endTime
    });
  };

  const stopRestTimer = () => {
    setRestTimer({
      isActive: false,
      endTime: null
    });
  };

  const addRestTime = (seconds) => {
    setRestTimer(prev => ({
      ...prev,
      endTime: prev.endTime + (seconds * 1000)
    }));
  };

  const makeMeAdmin = async () => {
    if (!user || !db) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { isAdmin: true });
        setIsAdmin(true);
        toast.success("You are now an Admin!");
    } catch (e) {
        console.error(e);
        toast.error("Failed to make admin");
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    logout,
    workoutLogs,
    userStats,
    logSet,
    getMachineHistory,
    getTodaysWorkout,
    restTimer,
    startRestTimer,
    stopRestTimer,
    addRestTime,
    makeMeAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
