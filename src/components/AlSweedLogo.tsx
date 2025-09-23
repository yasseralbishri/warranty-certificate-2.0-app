import { useState } from 'react'

interface AlSweedLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  onClick?: () => void
}

export function AlSweedLogo({ size = 'md', showText = true, className = '', onClick }: AlSweedLogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: {
      image: 'w-6 h-6',
      text: 'text-xs',
      subtext: 'text-xs',
      spacing: 'mr-2'
    },
    md: {
      image: 'w-28 h-28',
      text: 'text-lg',
      subtext: 'text-sm',
      spacing: 'mr-3'
    },
    lg: {
      image: 'w-32 h-32',      // للشهادات والـ PDF
      text: 'text-3xl',        
      subtext: 'text-2xl',     
      spacing: 'mr-10'         
    }
  }

  const currentSize = sizeClasses[size]

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Logo Image */}
      <div className={`${currentSize.spacing} flex items-center justify-center`}>
        {!imageError ? (
          <img 
            src="/images/alsweed-logo.png" 
            alt="السويد - alsweed" 
            className={`${currentSize.image} object-contain max-w-full max-h-full`}
            onError={handleImageError}
            style={{
              aspectRatio: '1/1',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className={`font-bold text-[#0033cc] ${currentSize.text}`}>السويد</div>
            <div className={`text-[#0033cc] ${currentSize.subtext}`}>alsweed</div>
          </div>
        )}
      </div>

      {/* Text - only show if showText is true */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className={`font-bold text-[#0033cc] ${currentSize.text} leading-tight`}>
            السويد
          </div>
          <div className={`text-[#0033cc] ${currentSize.subtext} leading-tight`}>
            alsweed
          </div>
        </div>
      )}
    </div>
  )
}
