import { Link } from 'react-router-dom'
import machinesData from '../data/machines.json'
import KGFLogo from '../components/KGFLogo'
import PWAInstallPrompt from '../components/PWAInstallPrompt'
import WODCard from '../components/WODCard'
import UserStats from '../components/UserStats'
import AuthButton from '../components/AuthButton'
import Leaderboard from '../components/Leaderboard'
import TrainersSection from '../components/TrainersSection'
import FuelStation from '../components/FuelStation'
import { useState } from 'react'

const Home = () => {
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-8 sm:pt-20 sm:pb-12 text-center">
          {/* Auth & Profile */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            <Link to="/profile" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 hover:border-orange-500 transition-colors">
              <span className="text-xl">👤</span>
            </Link>
            <AuthButton />
          </div>

          <div className="mb-8 animate-slide-up">
            <KGFLogo size="xl" textColor="orange-outline" className="justify-center drop-shadow-[0_0_15px_rgba(255,107,53,0.3)]" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Instant access to professional equipment guides and workout variations.
          </p>

          {/* Main Action - Scan */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/scan"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-600 to-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 hover:from-orange-500 hover:to-red-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-900"></span>
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR Code
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Point your camera at any machine to start
            </p>
          </div>
        </div>
      </div>

      {/* Gamification & WOD Section */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <UserStats />
        <Leaderboard />
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Equipment</h2>
          <div className="h-px flex-1 bg-gray-800 ml-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(machinesData)
            .slice(0, showAllEquipment ? undefined : 4)
            .map(([categoryId, category], index) => (
            <Link
              key={categoryId}
              to={`/category/${categoryId}`}
              className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-800 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
                {category.thumbnail ? (
                    <img 
                      src={category.thumbnail} 
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 border border-gray-700">
                      {Object.keys(category.machines).length} Machines
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => setShowAllEquipment(!showAllEquipment)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all border border-gray-700 hover:border-gray-600"
          >
            {showAllEquipment ? 'Show Less' : 'View All Equipment'}
            <svg className={`w-4 h-4 transition-transform ${showAllEquipment ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Trainers Section */}
      <TrainersSection />

      {/* Fuel Station Section */}
      <FuelStation />

      {/* Instructions Section */}
      <div className="bg-gray-900/30 border-t border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700 text-orange-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">1. Locate QR</h3>
              <p className="text-sm text-gray-400">Find the unique QR code sticker on any gym machine.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700 text-orange-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">2. Scan Code</h3>
              <p className="text-sm text-gray-400">Use this app or your camera to scan the code instantly.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700 text-orange-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">3. Watch & Learn</h3>
              <p className="text-sm text-gray-400">View expert tutorials and master your form.</p>
            </div>
          </div>
        </div>
      </div>

      <PWAInstallPrompt />
    </div>
  )
}

export default Home