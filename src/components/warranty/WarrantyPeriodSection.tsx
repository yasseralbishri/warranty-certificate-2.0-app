import React, { memo } from 'react'
import { Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface WarrantyPeriodSectionProps {
  warrantyPeriod: number
  onWarrantyPeriodChange: (period: number) => void
}

export const WarrantyPeriodSection = memo(function WarrantyPeriodSection({
  warrantyPeriod,
  onWarrantyPeriodChange
}: WarrantyPeriodSectionProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
        <div className="p-2 bg-green-100 rounded-lg animate-pulse-slow">
          <Calendar className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">فترة الضمان</h3>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          مدة الضمان (بالأشهر) <span className="text-red-500">*</span>
        </label>
        <Input
          id="warrantyPeriod"
          type="number"
          min="1"
          max="60"
          value={warrantyPeriod}
          onChange={(e) => onWarrantyPeriodChange(parseInt(e.target.value) || 12)}
          placeholder="مدة الضمان"
          className="h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 placeholder:text-gray-400"
          style={{'--tw-ring-color': '#0033cc'} as React.CSSProperties}
          onFocus={(e) => {
            e.target.style.borderColor = '#0033cc';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 51, 204, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '';
            e.target.style.boxShadow = '';
          }}
        />
      </div>
    </div>
  )
})
