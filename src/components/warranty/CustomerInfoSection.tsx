import React, { memo } from 'react'
import { User } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CustomerInfoSectionProps {
  formData: {
    customerName: string
    phoneNumber: string
    invoiceNumber: string
  }
  onInputChange: (field: string, value: string) => void
}

export const CustomerInfoSection = memo(function CustomerInfoSection({
  formData,
  onInputChange
}: CustomerInfoSectionProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
        <div className="p-2 bg-blue-100 rounded-lg animate-pulse-slow">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">معلومات العميل</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            اسم العميل <span className="text-red-500">*</span>
          </label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => onInputChange('customerName', e.target.value)}
            placeholder="اسم العميل"
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder="رقم الهاتف"
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

        <div className="space-y-2 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            رقم الفاتورة <span className="text-red-500">*</span>
          </label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => onInputChange('invoiceNumber', e.target.value)}
            placeholder="رقم الفاتورة"
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
    </div>
  )
})
