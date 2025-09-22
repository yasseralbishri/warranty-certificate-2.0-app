import { useState, useMemo, useCallback, memo } from 'react'
import { useWarranties, useDeleteCustomer } from '@/hooks/useWarranties'
import { CertificateGenerator } from './CertificateGenerator'
import { EditWarrantyModal } from './EditWarrantyModal'
import { WarrantyStats } from './warranty/WarrantyStats'
import { WarrantySearch } from './warranty/WarrantySearch'
import { WarrantyFilters } from './warranty/WarrantyFilters'
import { WarrantyListWrapper } from './warranty/WarrantyListWrapper'
import type { WarrantyFormData } from '@/types'

export const WarrantyList = memo(function WarrantyList() {
  console.log('🔄 [WarrantyList] بدء تحميل مكون قائمة شهادات الضمان...')
  
  // All hooks must be at the top before any conditional logic
  const { data: warranties = [], isLoading, error, isError } = useWarranties()
  const [showCertificate, setShowCertificate] = useState(false)
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [selectedWarranties, setSelectedWarranties] = useState<any[]>([])
  const deleteCustomerMutation = useDeleteCustomer()
  
  console.log('📊 [WarrantyList] حالة البيانات:', {
    warranties: warranties,
    warrantiesLength: warranties?.length || 0,
    isLoading: isLoading,
    error: error,
    isError: isError
  })
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'expiring_soon'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all')
  const [productFilter, setProductFilter] = useState<string>('all')

  // Get unique products for filter dropdown
  const uniqueProducts = useMemo(() => {
    const products = warranties.map((w: any) => w.product?.name).filter(Boolean)
    return [...new Set(products)]
  }, [warranties])

  // Filter warranties based on search term and filters
  const filteredWarranties = useMemo(() => {
    let filtered = warranties

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter((warranty: any) => {
        const customer = warranty.customer
        if (!customer) return false

        // Search in customer name
        if (customer.name?.toLowerCase().includes(searchLower)) return true
        
        // Search in phone number
        if (customer.phone?.includes(searchTerm)) return true
        
        // Search in invoice number
        if (customer.invoice_number?.toLowerCase().includes(searchLower)) return true
        
        // Search in product name
        if (warranty.product?.name?.toLowerCase().includes(searchLower)) return true

        return false
      })
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((warranty: any) => {
        const now = new Date()
        const endDate = new Date(warranty.warranty_end_date)
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        
        switch (statusFilter) {
          case 'active':
            return endDate > now
          case 'expired':
            return endDate < now
          case 'expiring_soon':
            return endDate > now && endDate <= thirtyDaysFromNow
          default:
            return true
        }
      })
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter((warranty: any) => {
        const warrantyDate = new Date(warranty.created_at)
        
        switch (dateFilter) {
          case 'today':
            return warrantyDate.toDateString() === now.toDateString()
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return warrantyDate >= weekAgo
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return warrantyDate >= monthAgo
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return warrantyDate >= yearAgo
          default:
            return true
        }
      })
    }

    // Apply product filter
    if (productFilter !== 'all') {
      filtered = filtered.filter((warranty: any) => {
        return warranty.product?.name === productFilter
      })
    }

    return filtered
  }, [warranties, searchTerm, statusFilter, dateFilter, productFilter])

  // Group filtered warranties by customer
  const groupedWarranties = useMemo(() => {
    return (filteredWarranties as any[]).reduce((acc, warranty) => {
      const customerId = warranty.customer_id
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: warranty.customer,
          warranties: []
        }
      }
      acc[customerId].warranties.push(warranty)
      return acc
    }, {} as Record<string, { customer: any; warranties: any[] }>)
  }, [filteredWarranties])

  const handlePrintCertificate = useCallback((warranty: any) => {
    // Group warranties by customer
    const customerWarranties = (warranties as any[]).filter(w => w.customer_id === warranty.customer_id)
    
    // Create certificate data
    const certificateData: WarrantyFormData = {
      customerName: warranty.customer?.name || '',
      phoneNumber: warranty.customer?.phone || '',
      invoiceNumber: warranty.customer?.invoice_number || '',
      selectedProducts: customerWarranties.map(w => w.product_id),
      warrantyDuration: 'per_product',
      warrantyPeriod: 12, // This should be calculated from the actual warranty period
    }

    setSelectedWarranty({
      warrantyData: certificateData,
      products: customerWarranties.map(w => w.product),
      warranties: customerWarranties
    })
    setShowCertificate(true)
  }, [warranties])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const handleClearAllFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
    setProductFilter('all')
  }, [])

  const handleEditWarranty = useCallback((customer: any, warranties: any[]) => {
    setSelectedCustomer(customer)
    setSelectedWarranties(warranties)
    setShowEditModal(true)
  }, [])

  const handleDeleteWarranty = useCallback(async (customerId: string, customerName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف جميع شهادات الضمان للعميل "${customerName}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        await deleteCustomerMutation.mutateAsync(customerId)
      } catch (error) {
        console.error('Error deleting warranty:', error)
        alert('حدث خطأ أثناء حذف الشهادة. يرجى المحاولة مرة أخرى.')
      }
    }
  }, [deleteCustomerMutation])

  // Conditional rendering after all hooks
  if (showCertificate && selectedWarranty) {
    return (
      <CertificateGenerator
        warrantyData={selectedWarranty.warrantyData}
        products={selectedWarranty.products}
        onClose={() => setShowCertificate(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        <WarrantyStats warranties={warranties} groupedWarranties={groupedWarranties} />

      {/* Main Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">منطقة الشهادات</h1>
        <p className="text-gray-600">إدارة وعرض جميع شهادات الضمان</p>
      </div>

      <WarrantySearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={handleClearSearch}
        filteredCount={Object.keys(groupedWarranties).length}
        totalCount={warranties.length}
      />

      <WarrantyFilters
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        productFilter={productFilter}
        uniqueProducts={uniqueProducts}
        searchTerm={searchTerm}
        onStatusFilterChange={setStatusFilter}
        onDateFilterChange={setDateFilter}
        onProductFilterChange={setProductFilter}
        onClearAllFilters={handleClearAllFilters}
      />

      <WarrantyListWrapper
        isLoading={isLoading}
        warranties={warranties}
        groupedWarranties={groupedWarranties}
        searchTerm={searchTerm}
        onPrintCertificate={handlePrintCertificate}
        onEditWarranty={handleEditWarranty}
        onDeleteWarranty={handleDeleteWarranty}
        onClearSearch={handleClearSearch}
        isDeleting={deleteCustomerMutation.isPending}
      />
      </div>
      
      {/* Edit Modal */}
      <EditWarrantyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={selectedCustomer}
        warranties={selectedWarranties}
      />
    </div>
  )
})
