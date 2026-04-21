import { useState, useRef } from 'react'

const VideoTest = () => {
  const videoRef = useRef(null)
  const [videoInfo, setVideoInfo] = useState({})
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testVideo = async () => {
    const video = videoRef.current
    if (!video) return

    addLog('Testing video playback...')
    
    // Get video info
    const info = {
      canPlayType_mp4: video.canPlayType('video/mp4'),
      canPlayType_webm: video.canPlayType('video/webm'),
      userAgent: navigator.userAgent,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      autoplayAllowed: document.createElement('video').autoplay !== undefined
    }
    setVideoInfo(info)
    addLog(`Browser info: ${JSON.stringify(info)}`)

    // Test video loading
    try {
      video.muted = true
      await video.play()
      addLog('✅ Video play SUCCESS (muted)')
      video.pause()
      
      video.muted = false
      await video.play()
      addLog('✅ Video play SUCCESS (unmuted)')
      video.pause()
      
    } catch (error) {
      addLog(`❌ Video play FAILED: ${error.message}`)
      
      // Try fallback
      try {
        video.muted = true
        await video.play()
        addLog('⚠️ Video play SUCCESS with muted fallback')
      } catch (fallbackError) {
        addLog(`❌ Fallback FAILED: ${fallbackError.message}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mobile Video Debug Tool</h1>
        
        {/* Test Video */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Video Player</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              controls={true}
              muted
            >
              <source src="/machines/arm-machine/WristCurl.mp4" type="video/mp4" />
              Video not supported
            </video>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={testVideo}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
            >
              Run Video Test
            </button>
            
            <button 
              onClick={() => setLogs([])}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
          <pre className="text-sm text-green-400 overflow-auto">
            {JSON.stringify(videoInfo, null, 2)}
          </pre>
        </div>

        {/* Debug Logs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black rounded p-4 font-mono text-sm max-h-96 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Run Video Test" to start debugging...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`mb-1 ${
                  log.includes('✅') ? 'text-green-400' : 
                  log.includes('❌') ? 'text-red-400' : 
                  log.includes('⚠️') ? 'text-yellow-400' : 
                  'text-gray-300'
                }`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoTest