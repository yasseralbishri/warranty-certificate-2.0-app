import React, { memo } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
        {isLoading ? (
          <div className="space-y-6">
            {/* Loading Skeletons */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
})
