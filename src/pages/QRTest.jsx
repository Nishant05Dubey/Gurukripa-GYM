import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QRTest = () => {
  const [testUrl, setTestUrl] = useState('https://gurukripa-fitness.vercel.app/machine/arm-machine/grip-trainer')
  const navigate = useNavigate()

  const simulateQRScan = (url) => {
    console.log('Simulating QR scan with URL:', url)
    
    // Same logic as QR scanner
    let path = url
    
    if (path.startsWith('http')) {
      try {
        const urlObj = new URL(path)
        path = urlObj.pathname
        console.log('Extracted path:', path)
      } catch (e) {
        console.error('Invalid URL:', e)
        return
      }
    }
    
    if (path.includes('/machine/')) {
      console.log('Navigating to:', path)
      navigate(path, { replace: true })
    } else {
      console.log('Invalid path format:', path)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kgf-secondary via-gray-900 to-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">QR Code Testing</h1>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test QR URL Parsing</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test URL:</label>
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="w-full p-3 rounded-lg text-black"
                placeholder="Enter QR code URL to test"
              />
            </div>
            
            <button
              onClick={() => simulateQRScan(testUrl)}
              className="btn-primary w-full"
            >
              Simulate QR Scan
            </button>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Expected QR URLs</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-300 mb-1">Grip Trainer:</p>
              <button
                onClick={() => simulateQRScan('https://gurukripa-fitness.vercel.app/machine/arm-machine/grip-trainer')}
                className="text-kgf-accent hover:text-orange-300 text-sm break-all"
              >
                https://gurukripa-fitness.vercel.app/machine/arm-machine/grip-trainer
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Rowing Machine:</p>
              <button
                onClick={() => simulateQRScan('https://gurukripa-fitness.vercel.app/machine/back-machine-rowing/rowing-machine')}
                className="text-kgf-accent hover:text-orange-300 text-sm break-all"
              >
                https://gurukripa-fitness.vercel.app/machine/back-machine-rowing/rowing-machine
              </button>
            </div>
            
            <div>
              <p className="text-sm text-gray-300 mb-1">Relative Path:</p>
              <button
                onClick={() => simulateQRScan('/machine/arm-machine/grip-trainer')}
                className="text-kgf-accent hover:text-orange-300 text-sm break-all"
              >
                /machine/arm-machine/grip-trainer
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRTest