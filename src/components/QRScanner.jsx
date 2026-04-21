import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { useNavigate } from 'react-router-dom'

const QRScannerComponent = () => {
  const videoRef = useRef(null)
  const [scanner, setScanner] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (videoRef.current && !scanner) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code scanned:', result.data)
          
          // Handle both full URLs and relative paths
          let path = result.data
          
          // If it's a full URL, extract just the path portion
          if (path.startsWith('http')) {
            try {
              const url = new URL(path)
              path = url.pathname
              console.log('Extracted path from URL:', path)
            } catch (e) {
              console.error('Invalid URL format:', path)
              setError(`Invalid QR code format: ${path}`)
              setTimeout(() => setError(''), 5000)
              return
            }
          }
          
          // Expected path format: /machine/{category}/{machineName}
          if (path.includes('/machine/')) {
            console.log('Navigating to:', path)
            // Stop scanning when we successfully scan a code
            stopScanning()
            navigate(path, { replace: true })
          } else {
            console.log('Invalid path format:', path)
            setError(`Invalid QR code. Expected machine code, got: ${path}`)
            setTimeout(() => setError(''), 5000)
          }
        },
        {
          onDecodeError: () => {
            // Silently handle decode errors
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )
      setScanner(qrScanner)
      
      // Auto-start scanning
      qrScanner.start()
        .then(() => {
          setIsScanning(true)
          setError('')
        })
        .catch((err) => {
          console.error('Failed to start scanner:', err)
          setError('Camera access denied. Please allow camera permissions.')
        })
    }

    return () => {
      if (scanner) {
        scanner.destroy()
      }
    }
  }, [navigate, scanner])

  const startScanning = async () => {
    if (scanner) {
      try {
        await scanner.start()
        setIsScanning(true)
        setError('')
      } catch (err) {
        setError('Camera access denied. Please allow camera permissions.')
      }
    }
  }

  const stopScanning = () => {
    if (scanner) {
      scanner.stop()
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-white rounded-lg mx-auto mb-4"></div>
              <p>Position QR code within frame</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Manual controls removed for auto-start */}

      <div className="text-center text-gray-600 max-w-md">
        <p className="text-sm">
          Point your camera at a gym machine QR code to view exercise instructions and variations.
        </p>
      </div>
    </div>
  )
}

export default QRScannerComponent