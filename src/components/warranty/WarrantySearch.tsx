import React, { memo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WarrantySearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  filteredCount: number
  totalCount: number
}

export const WarrantySearch = memo(function WarrantySearch({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filteredCount,
  totalCount
}: WarrantySearchProps) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-white border-b border-gray-200">
        <CardTitle className="flex items-center text-xl font-bold text-gray-800">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          البحث في الضمانات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث بالاسم، رقم الهاتف، أو رقم الفاتورة..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-14 px-6 pr-12 text-lg border-2 border-gray-200 rounded-xl shadow-sm"
              onFocus={(e) => {
                e.target.style.borderColor = '#0033cc';
                e.target.style.boxShadow = '0 0 0 2px rgba(0, 51, 204, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = '';
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-100"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
        {searchTerm && (
          <div className="mt-4 p-3 rounded-lg border" style={{backgroundColor: 'rgba(0, 51, 204, 0.05)', borderColor: 'rgba(0, 51, 204, 0.2)'}}>
            <div className="text-sm font-medium" style={{color: 'rgba(0, 51, 204, 0.8)'}}>
              🔍 عرض {filteredCount} من أصل {totalCount} ضمان
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})
