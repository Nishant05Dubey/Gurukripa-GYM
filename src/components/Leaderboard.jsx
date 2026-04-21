import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '../lib/firebase';
import { useUser } from '../context/UserContext';

const Leaderboard = () => {
  const { user, userStats } = useUser();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, 'users');
        let querySnapshot;
        
        // Strategy 1: Try Server-Side Ordering
        try {
          const q = query(usersRef, orderBy('stats.xp', 'desc'), limit(10));
          querySnapshot = await getDocs(q);
        } catch (e) {
          // Fallback to Strategy 2
        }

        // Strategy 2: Fallback to Simple Query
        if (!querySnapshot || querySnapshot.empty) {
          const qFallback = query(usersRef, limit(50)); 
          querySnapshot = await getDocs(qFallback);
        }
        
        let fetchedLeaders = [];
        querySnapshot.forEach((doc) => {
          fetchedLeaders.push({ id: doc.id, ...doc.data() });
        });

        // Strategy 3: Inject Current User (if logged in and not in list)
        // This ensures the user ALWAYS sees themselves, even if offline/sync pending
        if (user && userStats) {
            const userInList = fetchedLeaders.find(l => l.id === user.uid);
            if (!userInList) {
                fetchedLeaders.push({
                    id: user.uid,
                    displayName: user.displayName || 'You',
                    stats: userStats,
                    isCurrentUser: true
                });
            } else {
                // Update the entry with latest local stats (which might be newer than cloud)
                userInList.stats = userStats;
                userInList.isCurrentUser = true;
            }
        }

        // Client-side sort
        fetchedLeaders.sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));
        
        // Take top 5
        setLeaders(fetchedLeaders.slice(0, 5));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, userStats]); // Re-run if user/stats change

  if (loading) return <div className="text-center text-gray-500 text-xs">Loading Top 5...</div>;
  if (error) return null;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🏆</span> Top Performers
      </h3>
      <div className="space-y-3">
        {leaders.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No active members yet. Start working out to join!
          </div>
        ) : (
          leaders.map((leader, index) => (
            <div key={leader.id} className={`flex items-center justify-between p-3 rounded-lg mb-2 ${leader.isCurrentUser ? 'bg-orange-900/30 border border-orange-500/50' : 'bg-gray-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-700 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="text-sm text-gray-300">
                  {leader.isCurrentUser ? (leader.displayName || 'You') : (leader.displayName || `User ${leader.id.slice(0, 4)}`)}
                  {leader.isCurrentUser && <span className="ml-2 text-xs text-orange-400">(You)</span>}
                </div>
              </div>
              <div className="text-sm font-bold text-orange-400">
                {leader.stats?.xp || 0} XP
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
