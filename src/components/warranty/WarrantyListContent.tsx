import React, { memo } from 'react'
import { FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WarrantyCard } from './WarrantyCard'

interface WarrantyListContentProps {
  isLoading: boolean
  warranties: any[]
  groupedWarranties: Record<string, { customer: any; warranties: any[] }>
  searchTerm: string
  onPrintCertificate: (warranty: any) => void
  onEditWarranty: (customer: any, warranties: any[]) => void
  onDeleteWarranty: (customerId: string, customerName: string) => void
  onClearSearch: () => void
  isDeleting: boolean
}

export const WarrantyListContent = memo(function WarrantyListContent({
  isLoading,
  warranties,
  groupedWarranties,
  searchTerm,
  onPrintCertificate,
  onEditWarranty,
  onDeleteWarranty,
  onClearSearch,
  isDeleting
}: WarrantyListContentProps) {
  console.log('🔄 [WarrantyListContent] بدء تحميل محتوى قائمة الشهادات...')
  console.log('📊 [WarrantyListContent] حالة البيانات:', {
    isLoading: isLoading,
    warrantiesLength: warranties?.length || 0,
    groupedWarrantiesKeys: Object.keys(groupedWarranties || {}),
    searchTerm: searchTerm,
    isDeleting: isDeleting
  })
  
  if (isLoading) {
    console.log('⏳ [WarrantyListContent] عرض شاشة التحميل...')
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <FileText className="h-12 w-12 animate-pulse" style={{color: '#0033cc'}} />
          <div className="absolute inset-0 h-12 w-12 border-4 rounded-full animate-spin" style={{borderColor: 'rgba(0, 51, 204, 0.2)', borderTopColor: '#0033cc'}}></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">جاري تحميل الضمانات</h3>
          <p className="text-gray-500">يرجى الانتظار...</p>
        </div>
      </div>
    )
  }

  if (warranties.length === 0) {
    console.log('📭 [WarrantyListContent] لا توجد شهادات ضمان للعرض')
    return (
      <div className="text-center py-16 space-y-6">
        <div className="inline-flex items-center justify-center p-6 bg-gray-100 rounded-full">
          <FileText className="h-16 w-16 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد شهادات ضمان</h3>
          <p className="text-gray-500 mb-6">قم بإنشاء أول شهادة ضمان للبدء في استخدام النظام</p>
          <Button className="text-white" size="lg" style={{backgroundColor: '#0033cc'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 51, 204, 0.8)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0033cc'; }}>
            إنشاء شهادة ضمان جديدة
          </Button>
        </div>
      </div>
    )
  }

  if (Object.keys(groupedWarranties).length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="inline-flex items-center justify-center p-6 bg-orange-100 rounded-full">
          <Search className="h-16 w-16 text-orange-500" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على نتائج</h3>
          <p className="text-gray-500 mb-2">لم يتم العثور على ضمانات تطابق معايير البحث</p>
          <p className="text-sm text-gray-400 mb-6">"{searchTerm}"</p>
          <Button
            variant="outline"
            onClick={onClearSearch}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            مسح البحث
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedWarranties).map(([customerId, group]: [string, any]) => (
        <WarrantyCard
          key={customerId}
          customerId={customerId}
          group={group}
          onPrintCertificate={onPrintCertificate}
          onEditWarranty={onEditWarranty}
          onDeleteWarranty={onDeleteWarranty}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
})
