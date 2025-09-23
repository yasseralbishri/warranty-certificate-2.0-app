import React, { memo } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface MessageDisplayProps {
  successMessage: string | null
  errorMessage: string | null
}

export const MessageDisplay = memo(function MessageDisplay({
  successMessage,
  errorMessage
}: MessageDisplayProps) {
  if (!successMessage && !errorMessage) return null

  return (
    <div className="space-y-4 mb-6">
      {successMessage && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden animate-bounce-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3 animate-pulse-slow">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-green-800 font-bold text-lg animate-fade-in">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {errorMessage && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50 rounded-2xl overflow-hidden animate-bounce-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3 animate-pulse-slow">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-800 font-bold text-lg animate-fade-in">{errorMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})
