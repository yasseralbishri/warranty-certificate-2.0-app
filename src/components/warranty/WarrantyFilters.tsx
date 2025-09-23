import React, { memo } from 'react'
import { 
  Filter, Shield, CalendarDays, Package, RotateCcw, ChevronDown, Search 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WarrantyFiltersProps {
  statusFilter: 'all' | 'active' | 'expired' | 'expiring_soon'
  dateFilter: 'all' | 'today' | 'week' | 'month' | 'year'
  productFilter: string
  uniqueProducts: string[]
  searchTerm: string
  onStatusFilterChange: (value: 'all' | 'active' | 'expired' | 'expiring_soon') => void
  onDateFilterChange: (value: 'all' | 'today' | 'week' | 'month' | 'year') => void
  onProductFilterChange: (value: string) => void
  onClearAllFilters: () => void
}

export const WarrantyFilters = memo(function WarrantyFilters({
  statusFilter,
  dateFilter,
  productFilter,
  uniqueProducts,
  searchTerm,
  onStatusFilterChange,
  onDateFilterChange,
  onProductFilterChange,
  onClearAllFilters
}: WarrantyFiltersProps) {
  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== 'all' || productFilter !== 'all' || searchTerm

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="flex items-center text-xl font-bold text-gray-800">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Filter className="h-6 w-6 text-blue-600" />
          </div>
          فلاتر البحث المتقدمة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Status Filter */}
          <div className="group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">حالة الضمان</label>
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as any)}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">🟢 نشط</option>
                <option value="expired">🔴 منتهي</option>
                <option value="expiring_soon">🟡 ينتهي قريباً</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Filter */}
          <div className="group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">تاريخ الإنشاء</label>
            </div>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value as any)}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="all">جميع التواريخ</option>
                <option value="today">📅 اليوم</option>
                <option value="week">📆 آخر أسبوع</option>
                <option value="month">🗓️ آخر شهر</option>
                <option value="year">📊 آخر سنة</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Product Filter */}
          <div className="group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">نوع المنتج</label>
            </div>
            <div className="relative">
              <select
                value={productFilter}
                onChange={(e) => onProductFilterChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-medium transition-all duration-200 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="all">جميع المنتجات</option>
                {uniqueProducts.map((product) => (
                  <option key={product} value={product}>
                    📦 {product}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-red-100 rounded-lg mr-3 group-hover:bg-red-200 transition-colors">
                <RotateCcw className="h-5 w-5 text-red-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">إعادة تعيين</label>
            </div>
            <Button
              onClick={onClearAllFilters}
              className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              مسح جميع الفلاتر
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-blue-800">الفلاتر النشطة</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {statusFilter !== 'all' && (
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4 mr-2" />
                  حالة: {statusFilter === 'active' ? 'نشط' : statusFilter === 'expired' ? 'منتهي' : 'ينتهي قريباً'}
                </div>
              )}
              {dateFilter !== 'all' && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  تاريخ: {dateFilter === 'today' ? 'اليوم' : dateFilter === 'week' ? 'آخر أسبوع' : dateFilter === 'month' ? 'آخر شهر' : 'آخر سنة'}
                </div>
              )}
              {productFilter !== 'all' && (
                <div className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Package className="h-4 w-4 mr-2" />
                  منتج: {productFilter}
                </div>
              )}
              {searchTerm && (
                <div className="flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Search className="h-4 w-4 mr-2" />
                  بحث: "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
