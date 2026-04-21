import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, limit } from "firebase/firestore";
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import machinesData from '../data/machines.json';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    open: 0,
    safetyIssues: 0,
    positiveFeedback: 0,
    totalWorkouts: 0,
    totalUsers: 0
  });

  const [analytics, setAnalytics] = useState({
    popularMachines: [],
    topUsers: [],
    activityTrend: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'kgf2025') {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid Password");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchReports(), fetchAnalytics()]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    const reportsRef = collection(db, 'maintenance_reports');
    const q = query(reportsRef, limit(100));
    const querySnapshot = await getDocs(q);

    const fetchedReports = [];
    querySnapshot.forEach((doc) => {
      fetchedReports.push({ id: doc.id, ...doc.data() });
    });
    
    fetchedReports.sort((a, b) => {
        const dateA = a.createdAt?.seconds || (a.timestamp ? new Date(a.timestamp).getTime()/1000 : 0);
        const dateB = b.createdAt?.seconds || (b.timestamp ? new Date(b.timestamp).getTime()/1000 : 0);
        return dateB - dateA;
    });

    setReports(fetchedReports);
    calculateReportStats(fetchedReports);
  };

  const fetchAnalytics = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(fetchedUsers);

      // --- Aggregation Logic ---
      
      // 1. Popular Machines
      const machineUsage = {};
      let totalWorkoutsGlobal = 0;

      fetchedUsers.forEach(user => {
        if (user.logs) {
          Object.entries(user.logs).forEach(([machineId, logs]) => {
            // Count total sets or just presence? Let's count total sets (logs length)
            const count = Array.isArray(logs) ? logs.length : 0;
            if (count > 0) {
              machineUsage[machineId] = (machineUsage[machineId] || 0) + count;
              totalWorkoutsGlobal += count;
            }
          });
        }
      });

      const popularMachinesData = Object.entries(machineUsage)
        .map(([id, count]) => ({
          name: machinesData[id]?.name || id, // Map ID to Name
          count: count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

      // 2. Top Users (by XP)
      const topUsersData = fetchedUsers
        .map(user => ({
          name: user.displayName || 'Anonymous',
          xp: user.stats?.xp || 0,
          workouts: user.stats?.totalWorkouts || 0
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 5);

      // 3. Activity Trend (Mock for now, or aggregate by date if logs have timestamps)
      // Since aggregating all dates client side is heavy, we'll mock a "Last 7 Days" trend based on random distribution or just show total
      // For a real app, we'd want a separate 'daily_stats' collection.
      // Let's try to aggregate actual dates from logs!
      const dateCounts = {};
      fetchedUsers.forEach(user => {
        if (user.logs) {
          Object.values(user.logs).flat().forEach(log => {
            if (log.date) {
              const dateStr = new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
            }
          });
        }
      });
      
      // Get last 7 days
      const trendData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        trendData.push({
          date: dateKey,
          workouts: dateCounts[dateKey] || 0
        });
      }

      setAnalytics({
        popularMachines: popularMachinesData,
        topUsers: topUsersData,
        activityTrend: trendData
      });

      setStats(prev => ({
        ...prev,
        totalUsers: fetchedUsers.length,
        totalWorkouts: totalWorkoutsGlobal
      }));

    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Don't block the UI, just show empty analytics
    }
  };

  const calculateReportStats = (data) => {
    const total = data.length;
    const resolved = data.filter(r => r.status === 'resolved').length;
    const open = total - resolved;
    const safetyIssues = data.filter(r => r.issueType === 'Safety').length;
    const positiveFeedback = data.filter(r => r.sentiment === 'positive').length;
    setStats(prev => ({ ...prev, total, resolved, open, safetyIssues, positiveFeedback }));
  };

  const markAsResolved = async (reportId) => {
    try {
      const reportRef = doc(db, 'maintenance_reports', reportId);
      await updateDoc(reportRef, {
        status: 'resolved',
        resolvedAt: new Date()
      });
      
      const updatedReports = reports.map(r => 
        r.id === reportId ? { ...r, status: 'resolved', resolvedAt: new Date() } : r
      );
      setReports(updatedReports);
      calculateReportStats(updatedReports);
      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update status");
    }
  };

  const getIssueTypeData = () => {
    const counts = {};
    reports.forEach(r => {
      const type = r.sentiment === 'positive' ? 'Positive Feedback' : (r.issueType || 'Other');
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-6">Enter password to view dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
          <div className="flex justify-center gap-4 mt-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-white">
              🏠 Home
            </Link>
            <Link to="/profile" className="text-sm text-gray-500 hover:text-white">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-orange-500">📊</span> Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Overview of gym maintenance and analytics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            ↻ Refresh
          </button>
          <Link to="/" className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
            <span>🏠</span> Home
          </Link>
          <Link to="/profile" className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Exit
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
              <div className="text-gray-400 text-xs uppercase font-bold mb-1">Total Users</div>
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
              <div className="text-gray-400 text-xs uppercase font-bold mb-1">Total Sets</div>
              <div className="text-3xl font-bold text-orange-500">{stats.totalWorkouts}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
               <div className="text-gray-400 text-xs uppercase font-bold mb-1">Open Issues</div>
               <div className="text-3xl font-bold text-red-500">{stats.open}</div>
            </div>
             <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
               <div className="text-gray-400 text-xs uppercase font-bold mb-1">Resolved</div>
               <div className="text-3xl font-bold text-green-500">{stats.resolved}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
              <div className="text-gray-400 text-xs uppercase font-bold mb-1">Safety Critical</div>
              <div className="text-3xl font-bold text-red-500">{stats.safetyIssues}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
              <div className="text-gray-400 text-xs uppercase font-bold mb-1">Positive Feedback</div>
              <div className="text-3xl font-bold text-pink-500">{stats.positiveFeedback}</div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Popular Machines Chart */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>💪</span> Most Popular Machines
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.popularMachines} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" stroke="#666" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#999" fontSize={11} width={100} />
                    <Tooltip 
                      cursor={{ fill: '#333' }}
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Trend Chart */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>📈</span> Activity Trend (Last 7 Days)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.activityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="workouts" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Issue Distribution */}
             <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-6">Report Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getIssueTypeData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getIssueTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {getIssueTypeData().map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports List */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Recent Reports</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {reports.length === 0 ? (
                  <div className="text-center text-gray-500 py-10 bg-gray-900/30 rounded-2xl">
                    No reports found. Everything is running smoothly!
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={report.id} 
                      className={`p-4 rounded-xl border ${report.status === 'resolved' ? 'bg-gray-900/30 border-gray-800 opacity-60' : 'bg-gray-800 border-orange-500/30'}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{report.machineName}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                              report.sentiment === 'positive' ? 'bg-pink-900 text-pink-200' :
                              report.issueType === 'Safety' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'
                            }`}>
                              {report.sentiment === 'positive' ? '❤️ Praise' : report.issueType}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{report.description}</p>
                          <div className="text-xs text-gray-600 mt-2">
                            Reported: {report.createdAt?.seconds ? new Date(report.createdAt.seconds * 1000).toLocaleDateString() : (report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'Unknown date')}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                           {report.status === 'resolved' ? (
                              <span className="text-green-500 text-sm font-bold flex items-center gap-1 bg-green-900/20 px-3 py-1 rounded-lg">
                                ✅ Resolved
                              </span>
                            ) : (
                              <button 
                                onClick={() => markAsResolved(report.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
                              >
                                {report.sentiment === 'positive' ? 'Acknowledge' : 'Mark Fixed'}
                              </button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminReports;
