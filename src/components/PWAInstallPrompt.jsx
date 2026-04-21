import { useState, useEffect } from 'react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    const handleAppInstalled = () => {
      console.log('GuruKripa Fitness app was installed')
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Hide for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white p-4 rounded-xl shadow-2xl z-50 animate-slide-up">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 rounded-xl blur opacity-20 animate-pulse"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Install GuruKripa Fitness App</h3>
            <p className="text-white/80 text-sm">Get the full experience!</p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <span>📱 Works offline</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <span>⚡ Faster loading</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <span>🏠 Home screen access</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* iOS Instructions (shown on iOS devices) */}
        {navigator.userAgent.match(/iPhone|iPad|iPod/i) && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg">
            <p className="text-xs text-white/90">
              <strong>iOS:</strong> Tap <span className="inline-block w-4 h-4 text-blue-300">⬆️</span> Share, then "Add to Home Screen"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PWAInstallPrompt