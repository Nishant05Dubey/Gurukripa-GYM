import { Link } from 'react-router-dom'
import QRScannerComponent from '../components/QRScanner'
import KGFLogo from '../components/KGFLogo'

const Scanner = () => {
  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
          <div className="text-center">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              QR Scanner
            </span>
          </div>
          <div className="w-16 flex justify-end">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900/50 rounded-2xl p-1 border border-gray-800 shadow-2xl shadow-orange-500/10 overflow-hidden">
          <QRScannerComponent />
        </div>
        
        {/* Help Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Scanning Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Hold your phone steady and ensure good lighting</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Position the QR code fully within the frame</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Keep camera 6-12 inches away from the code</span>
              </li>
            </ul>
          </div>

          {/* Manual Navigation */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-2">Having Trouble?</h3>
            <p className="text-sm text-gray-400 mb-6">
              If you can't scan the code, you can browse our equipment catalog manually.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-gray-600 group"
            >
              <span>Browse Equipment</span>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scanner