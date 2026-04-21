import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import WorkoutLogger from "../components/WorkoutLogger";
import HistoryView from "../components/HistoryView";
import machinesData from "../data/machines.json";
import KGFLogo from "../components/KGFLogo";
import MaintenanceModal from "../components/MaintenanceModal";

const MachineDetail = () => {
  const { category, machineName } = useParams();
  const [selectedVariation, setSelectedVariation] = useState("");
  const [machineInfo, setMachineInfo] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  useEffect(() => {
    if (category && machineName && machinesData[category]) {
      const categoryData = machinesData[category];
      const machineData = categoryData.machines[machineName];

      if (machineData) {
        setCategoryInfo(categoryData);
        setMachineInfo(machineData);
        if (machineData.variations && machineData.variations.length > 0) {
          setSelectedVariation(machineData.variations[0]);
        }
      }
    }
  }, [category, machineName]);

  if (!machineInfo || !categoryInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Machine Not Found</h2>
          <p className="mb-6 text-gray-400">The requested machine could not be found.</p>
          <Link to="/" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={`/category/${category}`} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider block">
              {categoryInfo.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <Link to="/scan" className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Machine Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            {machineInfo.name}
          </h1>
          <p className="text-gray-400">{machineInfo.description}</p>
          <button 
            onClick={() => setIsMaintenanceOpen(true)}
            className="mt-4 text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Report Issue
          </button>
        </div>

        {/* Workout Logging Section (Moved to Top) */}
        <WorkoutLogger machineId={machineName} machineName={machineInfo.name} />

        {/* Video Player Section */}
        {selectedVariation ? (
          <div className="mb-8">
            <VideoPlayer
              category={category}
              machineName={machineName}
              variation={selectedVariation}
              onVariationChange={setSelectedVariation}
              availableVariations={machineInfo.variations}
            />
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 mb-8 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">Video guides for this machine are being filmed.</p>
          </div>
        )}


        <HistoryView machineId={machineName} />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-bold text-white">Safety First</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Check equipment before use</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Start with lighter weights</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Maintain control at all times</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">💪</span>
              <h3 className="text-lg font-bold text-white">Pro Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Focus on full range of motion</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Breathe out during exertion</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Rest 60-90s between sets</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related Machines */}
        <div className="border-t border-gray-800 pt-8">
          <h3 className="text-xl font-bold text-white mb-6">More in {categoryInfo.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(categoryInfo.machines)
              .filter(([id]) => id !== machineName)
              .map(([id, machine]) => (
                <Link
                  key={id}
                  to={`/machine/${category}/${id}`}
                  className="group bg-gray-900/30 border border-gray-800 rounded-xl p-4 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">
                        {machine.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {machine.variations?.length || 0} Variations
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
      
      <MaintenanceModal 
        isOpen={isMaintenanceOpen} 
        onClose={() => setIsMaintenanceOpen(false)} 
        machineName={machineInfo.name} 
      />
    </div>
  );
};

export default MachineDetail;
