import React, { memo, useMemo } from 'react'
import { 
  FileText, User, CheckCircle, AlertTriangle, Clock, Calendar 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WarrantyStatsProps {
  warranties: any[]
  groupedWarranties: Record<string, { customer: any; warranties: any[] }>
}

export const WarrantyStats = memo(function WarrantyStats({ 
  warranties, 
  groupedWarranties 
}: WarrantyStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    const activeWarranties = warranties.filter((w: any) => new Date(w.warranty_end_date) > now).length
    const expiredWarranties = warranties.filter((w: any) => new Date(w.warranty_end_date) < now).length
    const expiringSoon = warranties.filter((w: any) => {
      const endDate = new Date(w.warranty_end_date)
      return endDate > now && endDate <= thirtyDaysFromNow
    }).length

    const total = warranties.length
    const activePercentage = total > 0 ? Math.round((activeWarranties / total) * 100) : 0
    const expiringSoonPercentage = total > 0 ? Math.round((expiringSoon / total) * 100) : 0
    const expiredPercentage = total > 0 ? Math.round((expiredWarranties / total) * 100) : 0

    return {
      activeWarranties,
      expiredWarranties,
      expiringSoon,
      activePercentage,
      expiringSoonPercentage,
      expiredPercentage
    }
  }, [warranties])

  const { activeWarranties, expiredWarranties, expiringSoon, activePercentage, expiringSoonPercentage, expiredPercentage } = stats

  return (
    <div className="space-y-6">
      {/* Main Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Warranties */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1 text-blue-600">{warranties.length}</div>
                <div className="text-sm font-semibold text-blue-800">إجمالي الضمانات</div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">{Object.keys(groupedWarranties).length}</div>
                <div className="text-sm font-semibold text-indigo-800">العملاء المسجلون</div>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Warranties */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">{activeWarranties}</div>
                <div className="text-sm font-semibold text-green-800">الضمانات النشطة</div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expired Warranties */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-1">{expiredWarranties}</div>
                <div className="text-sm font-semibold text-red-800">الضمانات المنتهية</div>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Expiring Soon */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">{expiringSoon}</div>
                <div className="text-sm font-semibold text-yellow-800">تنتهي خلال 30 يوم</div>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warranty Status Overview */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            نظرة عامة على حالة الضمانات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Warranty Percentage */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{activePercentage}%</div>
              <div className="text-sm text-gray-600">نسبة الضمانات النشطة</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${activePercentage}%`}}
                ></div>
              </div>
            </div>

            {/* Expiring Soon Percentage */}
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{expiringSoonPercentage}%</div>
              <div className="text-sm text-gray-600">تنتهي قريباً (30 يوم)</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${expiringSoonPercentage}%`}}
                ></div>
              </div>
            </div>

            {/* Expired Percentage */}
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{expiredPercentage}%</div>
              <div className="text-sm text-gray-600">نسبة الضمانات المنتهية</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${expiredPercentage}%`}}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
