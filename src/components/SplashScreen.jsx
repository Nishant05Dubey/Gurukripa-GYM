import { useState, useEffect } from 'react'
import KGFLogo from './KGFLogo'

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [animationStage, setAnimationStage] = useState('enter')

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage('logo-glow')
    }, 500)

    const timer2 = setTimeout(() => {
      setAnimationStage('text-reveal')
    }, 1500)

    const timer3 = setTimeout(() => {
      setAnimationStage('fade-out')
    }, 2800)

    const timer4 = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 3300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2) 
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-kgf-secondary transition-opacity duration-500 ${
      animationStage === 'fade-out' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kgf-primary/10 via-transparent to-kgf-accent/10"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-kgf-primary to-kgf-accent rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Radial Gradient Glow */}
        <div className={`absolute inset-0 bg-radial-gradient transition-opacity duration-1000 ${
          animationStage === 'logo-glow' ? 'opacity-30' : 'opacity-0'
        }`} 
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.3) 0%, transparent 70%)'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center space-y-8 text-center">
        {/* Logo with Animation */}
        <div className={`transition-all duration-1000 ${
          animationStage === 'enter' ? 'scale-50 opacity-0' : 
          animationStage === 'logo-glow' ? 'scale-110 opacity-100' :
          'scale-100 opacity-100'
        }`}>
          <div className={`transition-all duration-500 ${
            animationStage === 'logo-glow' ? 'drop-shadow-2xl' : ''
          }`}>
            <KGFLogo size="2xl" />
          </div>
        </div>

        {/* Animated Text */}
        <div className={`transition-all duration-1000 delay-500 ${
          animationStage === 'text-reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              Premium Fitness Experience
            </h2>
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-kgf-primary to-transparent"></div>
              <span className="text-sm font-medium tracking-wider">LOADING</span>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-kgf-primary to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className={`transition-all duration-1000 delay-700 ${
          animationStage === 'text-reveal' ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-kgf-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Premium Badge */}
        <div className={`absolute -bottom-16 transition-all duration-1000 delay-1000 ${
          animationStage === 'text-reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-gradient-to-r from-kgf-primary to-kgf-accent text-white text-xs px-4 py-1 rounded-full font-medium tracking-wider shadow-lg">
            PREMIUM EDITION
          </div>
        </div>
      </div>

      {/* Bottom Shine Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kgf-primary to-transparent opacity-50"></div>
    </div>
  )
}

export default SplashScreen