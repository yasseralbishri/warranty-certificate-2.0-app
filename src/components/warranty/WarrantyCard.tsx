import React, { memo } from 'react'
import { 
  User, Phone, Receipt, Calendar, CheckCircle, AlertTriangle, Clock, 
  Eye, Edit, Trash2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatPhoneNumber } from '@/lib/utils'

interface WarrantyCardProps {
  customerId: string
  group: {
    customer: any
    warranties: any[]
  }
  onPrintCertificate: (warranty: any) => void
  onEditWarranty: (customer: any, warranties: any[]) => void
  onDeleteWarranty: (customerId: string, customerName: string) => void
  isDeleting: boolean
}

export const WarrantyCard = memo(function WarrantyCard({
  customerId,
  group,
  onPrintCertificate,
  onEditWarranty,
  onDeleteWarranty,
  isDeleting
}: WarrantyCardProps) {
  // Get the latest expiry date from all warranties
  const latestExpiryDate = group.warranties.reduce((latest: string, warranty: any) => {
    return warranty.warranty_end_date > latest ? warranty.warranty_end_date : latest
  }, group.warranties[0]?.end_date || '')
  
  // Check if warranty is expired
  const isExpired = new Date(latestExpiryDate) < new Date()
  const isExpiringSoon = new Date(latestExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && !isExpired

  return (
    <Card className={`shadow-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
      isExpired ? 'bg-gradient-to-br from-white to-red-50' : 
      isExpiringSoon ? 'bg-gradient-to-br from-white to-yellow-50' : 
      'bg-gradient-to-br from-white to-green-50'
    } rounded-2xl`}>
      
      <CardHeader className={`border-b border-gray-200 ${
        isExpired ? 'bg-gradient-to-r from-red-50 to-red-100' : 
        isExpiringSoon ? 'bg-gradient-to-r from-yellow-50 to-yellow-100' : 
        'bg-gradient-to-r from-green-50 to-green-100'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              isExpired ? 'bg-red-100' : 
              isExpiringSoon ? 'bg-yellow-100' : 
              'bg-green-100'
            }`}>
              <User className={`h-6 w-6 ${
                isExpired ? 'text-red-600' : 
                isExpiringSoon ? 'text-yellow-600' : 
                'text-green-600'
              }`} />
            </div>
            {group.customer?.name}
          </CardTitle>
          
          {/* Status Badge */}
          <div className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium ${
            isExpired ? 'bg-red-600 text-white' : 
            isExpiringSoon ? 'bg-yellow-600 text-white' : 
            'bg-green-600 text-white'
          }`}>
            {isExpired ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-1" />
                منتهي الصلاحية
              </>
            ) : isExpiringSoon ? (
              <>
                <Clock className="h-4 w-4 mr-1" />
                ينتهي قريباً
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                الضمان ساري
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Phone */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">رقم الهاتف</div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {formatPhoneNumber(group.customer?.phone || '')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="h-5 w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">رقم الفاتورة</div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {group.customer?.invoice_number}
                </div>
              </div>
            </div>
          </div>

          {/* Created By */}
          {group.warranties[0]?.created_by_user && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1">أنشأ بواسطة</div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {group.warranties[0].created_by_user.full_name}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Expiry Date */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isExpired ? 'bg-red-100' : 
                isExpiringSoon ? 'bg-yellow-100' : 
                'bg-green-100'
              }`}>
                <Calendar className={`h-5 w-5 ${
                  isExpired ? 'text-red-600' : 
                  isExpiringSoon ? 'text-yellow-600' : 
                  'text-green-600'
                }`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">تاريخ انتهاء الضمان</div>
                <div className={`font-semibold text-sm sm:text-base ${
                  isExpired ? 'text-red-600' : 
                  isExpiringSoon ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {formatDate(latestExpiryDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={() => onPrintCertificate(group.warranties[0])}
            className="group relative bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 w-12 h-12 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border-0"
            title="عرض شهادة الضمان"
          >
            <Eye className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => onEditWarranty(group.customer, group.warranties)}
            className="group relative bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 w-12 h-12 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border-0"
            title="تعديل الشهادة"
          >
            <Edit className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => onDeleteWarranty(group.customer.id, group.customer.name)}
            disabled={isDeleting}
            className="group relative bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 w-12 h-12 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="حذف الشهادة"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})
