import { useState } from 'react'
import { Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserManagement } from './UserManagement'
import { SystemStats } from './SystemStats'

type AdminTab = 'users' | 'stats'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2 animate-slide-down">
          لوحة تحكم الإدارة
        </h1>
        <p className="text-gray-600 text-center">
          إدارة المستخدمين والإحصائيات
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 animate-slide-up">
        <div className="flex bg-white border-0 rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'users' 
                ? 'bg-white/20' 
                : 'bg-red-100'
            }`}>
              <Users className={`w-5 h-5 ${
                activeTab === 'users' 
                  ? 'text-white' 
                  : 'text-red-600'
              }`} />
            </div>
            إدارة المستخدمين
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-3 px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'stats' 
                ? 'bg-white/20' 
                : 'bg-red-100'
            }`}>
              <Activity className={`w-5 h-5 ${
                activeTab === 'stats' 
                  ? 'text-white' 
                  : 'text-red-600'
              }`} />
            </div>
            الإحصائيات
          </button>
        </div>
      </div>

      {/* Content */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center text-xl font-bold text-gray-800">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              {activeTab === 'users' ? (
                <Users className="w-6 h-6 text-red-600" />
              ) : (
                <Activity className="w-6 h-6 text-red-600" />
              )}
            </div>
            {activeTab === 'users' ? 'إدارة المستخدمين' : 'إحصائيات النظام'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === 'users' ? <UserManagement /> : <SystemStats />}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel
