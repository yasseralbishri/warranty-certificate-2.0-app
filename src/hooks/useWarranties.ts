import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { warrantyService } from '@/lib/supabase'
import type { WarrantyFormData, WarrantySearchParams } from '@/types'
import { calculateWarrantyEndDate } from '@/lib/utils'

// Query keys
export const warrantyKeys = {
  all: ['warranties'] as const,
  lists: () => [...warrantyKeys.all, 'list'] as const,
  list: (filters: WarrantySearchParams) => [...warrantyKeys.lists(), { filters }] as const,
}

// Get all warranties
export function useWarranties() {
  console.log('🔄 [useWarranties] بدء hook جلب شهادات الضمان...')
  
  const query = useQuery({
    queryKey: warrantyKeys.lists(),
    queryFn: warrantyService.getWarranties,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
  
  console.log('📊 [useWarranties] حالة الاستعلام:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess
  })
  
  return query
}

// Search warranties
export function useSearchWarranties(params: WarrantySearchParams) {
  console.log('🔄 [useSearchWarranties] بدء hook البحث عن شهادات الضمان...', params)
  
  const query = useQuery({
    queryKey: warrantyKeys.list(params),
    queryFn: () => warrantyService.searchWarranties(params),
    enabled: !!(params.invoiceNumber || params.phoneNumber),
  })
  
  console.log('📊 [useSearchWarranties] حالة البحث:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    enabled: !!(params.invoiceNumber || params.phoneNumber)
  })
  
  return query
}

// Get products
export function useProducts() {
  console.log('🔄 [useProducts] بدء hook جلب المنتجات...')
  
  const query = useQuery({
    queryKey: ['products'],
    queryFn: warrantyService.getProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes - products don't change often
  })
  
  console.log('📊 [useProducts] حالة جلب المنتجات:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess
  })
  
  return query
}

// Create warranty mutation
export function useCreateWarranty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: WarrantyFormData) => {
      // Create customer first
      const customer = await warrantyService.createCustomer({
        name: formData.customerName,
        phone: formData.phoneNumber,
        invoice_number: formData.invoiceNumber,
      })

      // Calculate warranty dates
      const startDate = new Date().toISOString()
      const endDate = calculateWarrantyEndDate(new Date(), formData.warrantyPeriod).toISOString()

      // Create warranties for selected products
      const warranties = formData.selectedProducts.map((productId: string, index: number) => ({
        customer_id: (customer as any).id,
        product_id: productId,
        warranty_number: `${formData.invoiceNumber}-${productId}-${Date.now()}-${index}`,
        purchase_date: startDate,
        warranty_start_date: startDate,
        warranty_end_date: endDate,
        warranty_duration_months: formData.warrantyPeriod,
        notes: null,
      }))

      return warrantyService.createWarranties(warranties, formData.userId)
    },
    onSuccess: () => {
      // Invalidate and refetch warranties
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() })
    },
  })
}

// Delete warranty mutation
export function useDeleteWarranty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: warrantyService.deleteWarranty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() })
    },
  })
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: warrantyService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() })
    },
  })
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, updates }: { customerId: string; updates: any }) => 
      warrantyService.updateCustomer(customerId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() })
    },
  })
}

// Update warranty mutation
export function useUpdateWarranty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ warrantyId, updates }: { warrantyId: string; updates: any }) => 
      warrantyService.updateWarranty(warrantyId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() })
    },
  })
}

// Initialize sample data
export function useInitializeSampleData() {
  return useMutation({
    mutationFn: warrantyService.initializeSampleData,
  })
}
