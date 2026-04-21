import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import MachineDetail from './pages/MachineDetail'
import CategoryBrowse from './pages/CategoryBrowse'
import QRTest from './pages/QRTest'
import VideoTest from './pages/VideoTest'
import SplashScreen from './components/SplashScreen'
import { UserProvider } from './context/UserContext'

import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile'
import AdminReports from './pages/AdminReports'
import RestTimer from './components/RestTimer'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <UserProvider>
      <div className="min-h-screen bg-black text-white animate-fade-in">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }} />
        <RestTimer />
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminReports />} />
          <Route path="/category/:categoryId" element={<CategoryBrowse />} />
          <Route path="/machine/:category/:machineName" element={<MachineDetail />} />
          <Route path="/qr-test" element={<QRTest />} />
          <Route path="/video-test" element={<VideoTest />} />
        </Routes>
        <Analytics />
      </div>
    </UserProvider>
  )
}

export default App