import React, { memo } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WarrantyListContent } from './WarrantyListContent'

interface WarrantyListWrapperProps {
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

export const WarrantyListWrapper = memo(function WarrantyListWrapper({
  isLoading,
  warranties,
  groupedWarranties,
  searchTerm,
  onPrintCertificate,
  onEditWarranty,
  onDeleteWarranty,
  onClearSearch,
  isDeleting
}: WarrantyListWrapperProps) {
  console.log('🔄 [WarrantyListWrapper] بدء تحميل wrapper قائمة الشهادات...')
  console.log('📊 [WarrantyListWrapper] حالة البيانات:', {
    isLoading: isLoading,
    warrantiesLength: warranties?.length || 0,
    groupedWarrantiesKeys: Object.keys(groupedWarranties || {}),
    searchTerm: searchTerm,
    isDeleting: isDeleting
  })
  
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          قائمة الشهادات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <WarrantyListContent
          isLoading={isLoading}
          warranties={warranties}
          groupedWarranties={groupedWarranties}
          searchTerm={searchTerm}
          onPrintCertificate={onPrintCertificate}
          onEditWarranty={onEditWarranty}
          onDeleteWarranty={onDeleteWarranty}
          onClearSearch={onClearSearch}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  )
})
