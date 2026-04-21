import { useState, useRef, useEffect } from 'react'

const VideoPlayer = ({ category, machineName, variation, onVariationChange, availableVariations }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [hasError, setHasError] = useState(false)

  const videoPath = `/machines/${category}/${variation}.mp4`
  const [networkSpeed, setNetworkSpeed] = useState('fast')
  
  // Detect network speed and adjust video quality
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        setNetworkSpeed('slow')
      } else if (connection.effectiveType === '3g') {
        setNetworkSpeed('medium')
      }
    }
  }, [])

  // Effect to handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)
    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
      setLoadProgress(100)
    }
    const handleLoadStart = () => {
      setIsLoading(true)
      setLoadProgress(0)
      setHasError(false)
    }
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const buffered = video.buffered.end(0)
        const progress = (buffered / video.duration) * 100
        setLoadProgress(progress)
      }
    }
    const handleCanPlay = () => {
      setIsLoading(false)
      setLoadProgress(100)
    }
    const handleError = (e) => {
      console.error('Video loading error:', e)
      setIsLoading(false)
      setHasError(true)
      setLoadProgress(0)
    }
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlayThrough = () => setIsLoading(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // Effect to update video source when variation changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Pause the video and reset states
    video.pause()
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    setLoadProgress(0)
    setHasError(false)

    // Update video source
    video.src = videoPath
    video.muted = false // Try unmuted first
    
    const playVideo = async () => {
      try {
        await video.load()
        const playPromise = video.play()
        if (playPromise !== undefined) {
          await playPromise
          setIsPlaying(true)
        }
      } catch (error) {
        console.log('Autoplay blocked or failed:', error)
        // If unmuted autoplay fails, we can try muted, or just show the error/play button
        // For a premium feel, we'll show the "Tap to Play" overlay via hasError state or a new state
        // But reusing hasError with a specific message is easier for now, or just letting the user tap play.
        // Actually, let's try muted fallback immediately.
        try {
          video.muted = true
          await video.play()
          setIsPlaying(true)
          // Show a toast or small indicator that sound is muted? 
          // For now, just playing is better than nothing.
        } catch (mutedError) {
           setHasError(true)
        }
      }
    }

    playVideo()

    console.log('Video source updated to:', videoPath)
  }, [variation, videoPath])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    
    try {
      if (video.paused) {
        // Unmute and play for mobile
        video.muted = false
        const playPromise = video.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        setIsPlaying(true)
      } else {
        video.pause()
        setIsPlaying(false)
      }
    } catch (error) {
      console.error('Video play error:', error)
      // Try with muted for mobile browsers that require it
      if (error.name === 'NotAllowedError') {
        try {
          video.muted = true
          await video.play()
          setIsPlaying(true)
        } catch (mutedError) {
          console.error('Muted video play failed:', mutedError)
          setHasError(true)
        }
      }
    }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!document.fullscreenElement) {
      video.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      
      
      {/* Variation Selector - Enhanced for Mobile (Moved to Top) */}
      {availableVariations && availableVariations.length > 1 && (
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 sm:p-6 border-b border-gray-700">
          <div className="text-center mb-4">
            <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Exercise Variations
            </h4>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {availableVariations.map((variationOption) => (
              <div key={variationOption} className="relative group">
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 rounded-xl opacity-0 blur transition-all duration-300 ${
                  variation === variationOption
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 opacity-75'
                    : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 group-hover:opacity-50'
                }`}></div>
                
                <button
                  onClick={() => onVariationChange(variationOption)}
                  disabled={isLoading && variation !== variationOption}
                  className={`relative w-full p-4 rounded-xl text-left transition-all duration-300 transform active:scale-95 sm:hover:scale-105 flex items-center space-x-3 ${
                    variation === variationOption
                      ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white shadow-xl'
                      : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-gray-200 hover:from-gray-600/80 hover:to-gray-700/80 border border-gray-600 hover:border-orange-500/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    variation === variationOption
                      ? 'bg-white/20'
                      : 'bg-orange-500/20'
                  }`}>
                    {isLoading && variation === variationOption ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h5 className={`font-bold text-base sm:text-lg mb-1 ${
                      variation === variationOption ? 'text-white' : 'text-white'
                    }`}>
                      {variationOption.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h5>
                    <p className={`text-sm ${
                      variation === variationOption ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {variation === variationOption ? 'Currently Playing' : 'Tap to Watch'}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className={`transform transition-transform duration-300 ${
                    variation === variationOption ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          {/* Bottom Accent */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full border border-orange-500/20">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              <span className="text-orange-300 text-xs font-medium">Choose Your Exercise</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Element */}
      <div className="relative aspect-[9/16] max-h-[80vh] mx-auto">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          webkit-playsinline="true"
          controls
          controlsList="nodownload"
          muted={false}
          autoPlay={true}
        >
          <source src={videoPath} type="video/mp4; codecs=avc1.640028,mp4a.40.2" />
          <source src={videoPath} type="video/mp4" />
          <p className="text-white text-center p-4">
            Your browser does not support video playback. Please try updating your browser or use a different device.
          </p>
        </video>

        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white max-w-xs">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kgf-primary mx-auto mb-4"></div>
              <p className="text-sm mb-3">Loading video...</p>
              {loadProgress > 0 && (
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-kgf-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  ></div>
                </div>
              )}
              <p className="text-xs text-gray-300 mt-2">
                {loadProgress > 0 ? `${Math.round(loadProgress)}% loaded` : 'Preparing...'}
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white max-w-xs">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-sm mb-2">Failed to load video</p>
              <p className="text-xs text-gray-300 mb-4">Check your internet connection</p>
              <button 
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    setHasError(false);
                    setIsLoading(true);
                    video.load();
                  }
                }}
                className="px-3 py-1 bg-kgf-primary text-white rounded text-sm hover:bg-orange-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Custom Video Controls Overlay - Hidden when native controls are enabled */}
        {!isLoading && false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={togglePlay}
              onTouchStart={(e) => e.preventDefault()}
              className="bg-white bg-opacity-90 rounded-full p-6 md:p-4 hover:bg-opacity-100 transition-all duration-200 shadow-xl active:scale-95"
            >
              {isPlaying ? (
                <svg className="w-10 h-10 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-10 h-10 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
      </div>

      {/* Control Bar - Hidden when using native controls */}
      <div className="bg-gray-900 text-white p-4" style={{ display: 'none' }}>
        {/* Progress Bar */}
        <div
          className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-kgf-primary rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="hover:text-kgf-primary transition-colors">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <button onClick={toggleFullscreen} className="hover:text-kgf-primary transition-colors">
            Fullscreen
          </button>
        </div>
      </div>


    </div>
  )
}

export default VideoPlayer