import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Building, TrendingUp, Calendar, Shield } from 'lucide-react'

interface Stats {
  totalUsers: number
  activeUsers: number
  totalWarranties: number
  totalCustomers: number
  totalProducts: number
  adminsCount: number
  recentWarranties: any[]
}

export function SystemStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalWarranties: 0,
    totalCustomers: 0,
    totalProducts: 0,
    adminsCount: 0,
    recentWarranties: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all stats in parallel
      const [
        usersResult,
        warrantiesResult,
        customersResult,
        productsResult,
        recentWarrantiesResult
      ] = await Promise.all([
        supabase.from('user_profiles').select('*'),
        supabase.from('warranties').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('products').select('*'),
        supabase
          .from('warranties')
          .select(`
            *,
            customer:customers(*),
            product:products(*),
            created_by_user:user_profiles!created_by(*)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      const users = usersResult.data || []
      const warranties = warrantiesResult.data || []
      const customers = customersResult.data || []
      const products = productsResult.data || []
      const recentWarranties = recentWarrantiesResult.data || []

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.is_active).length,
        totalWarranties: warranties.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        adminsCount: users.filter((u: any) => u.role === 'admin').length,
        recentWarranties
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'المستخدمين النشطين',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'المديرين',
      value: stats.adminsCount,
      icon: Shield,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'إجمالي الضمانات',
      value: stats.totalWarranties,
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'إجمالي العملاء',
      value: stats.totalCustomers,
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts,
      icon: Building,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ]

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            آخر الضمانات المُضافة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentWarranties.length > 0 ? (
            <div className="space-y-4">
              {stats.recentWarranties.map((warranty) => (
                <div key={warranty.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {warranty.customer?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {warranty.product?.name} - {warranty.customer?.invoice_number}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      تم الإنشاء: {new Date(warranty.created_at).toLocaleDateString('ar-SA')}
                      {warranty.created_by_user && (
                        <span> بواسطة {warranty.created_by_user.full_name}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      {new Date(warranty.warranty_start_date).toLocaleDateString('ar-SA')}
                    </p>
                    <p className="text-xs text-gray-500">إلى</p>
                    <p className="text-sm font-medium text-red-600">
                      {new Date(warranty.warranty_end_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد ضمانات حديثة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
