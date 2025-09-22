import { useState, useCallback } from 'react'
import { Plus, List } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WarrantyForm } from './WarrantyForm'
import { WarrantyList } from './WarrantyList'

interface DashboardProps {
  onNavigateToForm?: () => void
}

function Dashboard({ onNavigateToForm }: DashboardProps) {
  console.log('🔄 [Dashboard] بدء تحميل لوحة التحكم...')
  
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form')
  
  console.log('📊 [Dashboard] التبويب النشط:', activeTab)

  // Expose navigation function to parent component
  const navigateToForm = useCallback(() => {
    setActiveTab('form')
    onNavigateToForm?.()
  }, [onNavigateToForm])

  // Make navigateToForm available globally for logo click
  if (typeof window !== 'undefined') {
    (window as any).navigateToWarrantyForm = navigateToForm
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2 animate-slide-down">نظام إدارة شهادات الضمان</h1>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex justify-center mb-8 animate-slide-up">
        <div className="flex bg-white border-0 rounded-2xl shadow-xl overflow-hidden animate-bounce-in">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-3 px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'form' 
                ? 'bg-white/20' 
                : 'bg-blue-100'
            }`}>
              <Plus className={`w-5 h-5 ${
                activeTab === 'form' 
                  ? 'text-white' 
                  : 'text-blue-600'
              }`} />
            </div>
            إضافة ضمان جديد
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-3 px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'list' 
                ? 'bg-white/20' 
                : 'bg-blue-100'
            }`}>
              <List className={`w-5 h-5 ${
                activeTab === 'list' 
                  ? 'text-white' 
                  : 'text-blue-600'
              }`} />
            </div>
            قائمة الشهادات
          </button>
        </div>
      </div>

      {/* Content */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-500">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center text-xl font-bold text-gray-800 animate-slide-in-right">
            <div className="p-2 bg-blue-100 rounded-lg mr-3 animate-pulse-slow">
              {activeTab === 'form' ? (
                <Plus className="w-6 h-6 text-blue-600" />
              ) : (
                <List className="w-6 h-6 text-blue-600" />
              )}
            </div>
            {activeTab === 'form' ? 'إضافة ضمان جديد' : 'قائمة الشهادات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 animate-fade-in">
          {activeTab === 'form' ? <WarrantyForm /> : <WarrantyList />}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
