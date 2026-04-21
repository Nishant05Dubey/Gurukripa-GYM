import { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

const MaintenanceModal = ({ isOpen, onClose, machineName }) => {
  const [category, setCategory] = useState(machineName ? 'Machine' : 'Website');
  const [sentiment, setSentiment] = useState('negative'); // 'positive' or 'negative'
  const [issueType, setIssueType] = useState('Other');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCategory(machineName ? 'Machine' : 'Website');
      setSentiment('negative');
      setIssueType('Other');
      setDescription('');
    }
  }, [isOpen, machineName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Fire and forget - don't await to prevent UI blocking
    if (db) {
      addDoc(collection(db, "maintenance_reports"), {
        machineName: category === 'Machine' ? (machineName || 'General Machine') : 'Website',
        category, // 'Machine' or 'Website'
        sentiment, // 'positive' or 'negative'
        issueType: sentiment === 'positive' ? 'Praise' : issueType,
        description,
        status: 'open',
        timestamp: new Date().toISOString()
      }).catch(err => console.error("Background sync failed:", err));
    }
    
    // Immediate feedback to user
    const message = sentiment === 'positive' 
      ? 'Thanks for the love! ❤️' 
      : 'Report Submitted! We will check it. 🔧';
      
    toast.success(message);
    setSubmitting(false);
    onClose();
  };

  const getOptions = () => {
    if (sentiment === 'positive') return ['General Praise', 'Feature Love', 'Suggestion'];
    if (category === 'Website') return ['Bug', 'Slow Loading', 'Feature Request', 'Other'];
    return ['Cable Issue', 'Seat/Adjustment Stuck', 'Pin Missing/Broken', 'Upholstery Tear', 'Other'];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {sentiment === 'positive' ? 'Send Feedback' : 'Report Issue'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sentiment Toggle */}
          <div className="flex bg-black rounded-xl p-1 border border-gray-800">
            <button
              type="button"
              onClick={() => setSentiment('negative')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                sentiment === 'negative' ? 'bg-red-900/50 text-red-200' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              ⚠️ Issue
            </button>
            <button
              type="button"
              onClick={() => setSentiment('positive')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                sentiment === 'positive' ? 'bg-green-900/50 text-green-200' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              ❤️ Praise
            </button>
          </div>

          {/* Category Selector (Only if not pre-set to a machine) */}
          {!machineName && (
             <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Website">Website / App</option>
                <option value="Machine">Gym Equipment</option>
              </select>
            </div>
          )}

          {/* Issue Type (Hidden for positive if we just want generic praise, but let's keep it simple) */}
          {sentiment === 'negative' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select 
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              >
                {getOptions().map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {sentiment === 'positive' ? 'What do you like?' : 'Description'}
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={sentiment === 'positive' ? "Tell us what you enjoy..." : "Describe the problem..."}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none h-32 resize-none"
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className={`w-full font-bold py-4 rounded-xl transition-colors disabled:opacity-50 ${
              sentiment === 'positive' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {submitting ? 'Sending...' : (sentiment === 'positive' ? 'Send Love' : 'Submit Report')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
