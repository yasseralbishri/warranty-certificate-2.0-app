import { useState, useEffect } from 'react'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'header' | 'certificate' | 'pdf'
  showText?: boolean
  className?: string
  alt?: string
}

export function Logo({ 
  size = 'md', 
  variant = 'header', 
  showText = true, 
  className = '',
  alt = 'السويد - alsweed'
}: LogoProps) {
  const [imageError, setImageError] = useState(false)

  // Size configurations for different contexts
  const sizeConfig = {
    xs: {
      image: 'w-4 h-4',
      text: 'text-xs',
      subtext: 'text-xs',
      spacing: 'mr-1',
      container: 'h-4'
    },
    sm: {
      image: 'w-6 h-6',
      text: 'text-xs',
      subtext: 'text-xs',
      spacing: 'mr-2',
      container: 'h-6'
    },
    md: {
      image: 'w-8 h-8',
      text: 'text-sm',
      subtext: 'text-xs',
      spacing: 'mr-3',
      container: 'h-8'
    },
    lg: {
      image: 'w-12 h-12',
      text: 'text-lg',
      subtext: 'text-sm',
      spacing: 'mr-4',
      container: 'h-12'
    },
    xl: {
      image: 'w-16 h-16',
      text: 'text-xl',
      subtext: 'text-lg',
      spacing: 'mr-6',
      container: 'h-16'
    }
  }


  const currentSize = sizeConfig[size]

  // Handle image load error
  const handleImageError = () => {
    setImageError(true)
  }

  // Fallback text component
  const FallbackText = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`font-bold ${currentSize.text}`} style={{color: '#0033cc'}}>
        السويد
      </div>
      <div className={`${currentSize.subtext}`} style={{color: 'rgba(0, 51, 204, 0.7)'}}>
        alsweed
      </div>
    </div>
  )

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Container */}
      <div className={`${currentSize.spacing} flex items-center justify-center ${currentSize.container}`}>
        {!imageError ? (
          <img 
            src="/images/alsweed-logo.png" 
            alt={alt}
            className={`${currentSize.image} object-contain max-w-full max-h-full`}
            onError={handleImageError}
            style={{
              // Ensure aspect ratio is maintained
              aspectRatio: '1/1',
              // Prevent image from breaking layout
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        ) : (
          <FallbackText />
        )}
      </div>

      {/* Text - only show if showText is true and variant allows it */}
      {showText && variant !== 'pdf' && (
        <div className="flex flex-col">
          <div className={`font-bold ${currentSize.text}`} style={{color: '#0033cc'}}>
            السويد
          </div>
          <div className={`${currentSize.subtext}`} style={{color: 'rgba(0, 51, 204, 0.7)'}}>
            alsweed
          </div>
        </div>
      )}
    </div>
  )
}

// Responsive Logo Hook
export function useResponsiveLogo(variant: 'header' | 'certificate' | 'pdf' = 'header') {
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const responsiveConfig = {
    header: {
      mobile: 'sm',
      desktop: 'md'
    },
    certificate: {
      mobile: 'md',
      desktop: 'lg'
    },
    pdf: {
      mobile: 'lg',
      desktop: 'xl'
    }
  }

  return responsiveConfig[variant][isMobile ? 'mobile' : 'desktop']
}

// PDF-specific Logo Component
export function PDFLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="text-center">
        {/* Logo Image */}
        <div className="flex justify-center mb-2">
          <img 
            src="/images/alsweed-logo.png" 
            alt="السويد - alsweed"
            className="w-32 h-32 object-contain"
            style={{
              aspectRatio: '1/1',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center">
                  </div>
                `
              }
            }}
          />
        </div>
        
        {/* Company Text */}
        <div className="text-center">
        </div>
      </div>
    </div>
  )
}

