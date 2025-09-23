import { useState, useEffect, memo } from 'react'
import { X, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateCustomer, useUpdateWarranty, useProducts } from '@/hooks/useWarranties'
import { sanitizeInput, calculateWarrantyEndDate } from '@/lib/utils'
import { warrantyService } from '@/lib/supabase'
import { CustomerInfoSection } from './warranty/CustomerInfoSection'
import { WarrantyPeriodSection } from './warranty/WarrantyPeriodSection'
import { ProductSelectionSection } from './warranty/ProductSelectionSection'
import { MessageDisplay } from './warranty/MessageDisplay'
import { ActionButtons } from './warranty/ActionButtons'
import type { Customer, Warranty, Product } from '@/types'

interface EditWarrantyModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer
  warranties: Warranty[]
}

export const EditWarrantyModal = memo(function EditWarrantyModal({ isOpen, onClose, customer, warranties }: EditWarrantyModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    invoiceNumber: '',
    warrantyPeriod: 12,
    selectedProducts: [] as string[],
  })

  const [warrantyDates, setWarrantyDates] = useState<{[key: string]: {startDate: string, endDate: string}}>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateCustomerMutation = useUpdateCustomer()
  const updateWarrantyMutation = useUpdateWarranty()
  const { data: products = [] } = useProducts()

  useEffect(() => {
    if (customer && warranties) {
      const selectedProducts = warranties.map(w => w.product_id)
      const dates: {[key: string]: {startDate: string, endDate: string}} = {}
      
      warranties.forEach(warranty => {
        dates[warranty.product_id] = {
          startDate: warranty.warranty_start_date.split('T')[0], // Extract date part only
          endDate: warranty.warranty_end_date.split('T')[0]
        }
      })

      setFormData({
        customerName: customer.name || '',
        phoneNumber: customer.phone || '',
        invoiceNumber: customer.invoice_number || '',
        warrantyPeriod: 12, // Default period
        selectedProducts,
      })
      
      setWarrantyDates(dates)
    }
  }, [customer, warranties])

  const handleInputChange = (field: string, value: string | number) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }))
  }

  const handleProductToggle = (productId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: checked 
        ? [...prev.selectedProducts, productId]
        : prev.selectedProducts.filter(id => id !== productId)
    }))

    // If adding a new product, set default dates
    if (checked && !warrantyDates[productId]) {
      const startDate = new Date().toISOString().split('T')[0]
      const endDate = calculateWarrantyEndDate(new Date(), formData.warrantyPeriod).toISOString().split('T')[0]
      
      setWarrantyDates(prev => ({
        ...prev,
        [productId]: { startDate, endDate }
      }))
    }
  }


  const handleWarrantyPeriodChange = (period: number) => {
    setFormData(prev => ({ ...prev, warrantyPeriod: period }))
    
    // Update end dates for all selected products
    const newDates = { ...warrantyDates }
    Object.keys(newDates).forEach(productId => {
      const startDate = new Date(newDates[productId].startDate)
      const endDate = calculateWarrantyEndDate(startDate, period)
      newDates[productId].endDate = endDate.toISOString().split('T')[0]
    })
    setWarrantyDates(newDates)
  }

  const handleSave = async () => {
    // Clear previous messages
    setErrorMessage(null)
    setSuccessMessage(null)
    
    try {
      // Validation
      if (!formData.customerName.trim()) {
        setErrorMessage('يرجى إدخال اسم العميل')
        return
      }
      
      if (!formData.phoneNumber.trim()) {
        setErrorMessage('يرجى إدخال رقم الهاتف')
        return
      }
      
      if (!formData.invoiceNumber.trim()) {
        setErrorMessage('يرجى إدخال رقم الفاتورة')
        return
      }
      
      if (formData.selectedProducts.length === 0) {
        setErrorMessage('يرجى اختيار شركة واحدة على الأقل')
        return
      }

      // Update customer information
      await updateCustomerMutation.mutateAsync({
        customerId: customer.id,
        updates: {
          name: formData.customerName,
          phone: formData.phoneNumber,
          invoice_number: formData.invoiceNumber,
        }
      })

      // Delete warranties for products that are no longer selected
      for (const warranty of warranties) {
        if (!formData.selectedProducts.includes(warranty.product_id)) {
          await warrantyService.deleteWarranty(warranty.id)
        }
      }

      // Update or create warranties for selected products
      for (const productId of formData.selectedProducts) {
        const dates = warrantyDates[productId]
        if (dates) {
          // Find existing warranty for this product
          const existingWarranty = warranties.find(w => w.product_id === productId)
          
          if (existingWarranty) {
            // Update existing warranty
            await updateWarrantyMutation.mutateAsync({
              warrantyId: existingWarranty.id,
              updates: {
                warranty_start_date: new Date(dates.startDate).toISOString(),
                warranty_end_date: new Date(dates.endDate).toISOString(),
              }
            })
          } else {
            // Create new warranty for newly selected product
            await warrantyService.createWarranties([{
              customer_id: customer.id,
              product_id: productId,
              warranty_number: `${formData.invoiceNumber}-${productId}-${Date.now()}`,
              purchase_date: new Date(dates.startDate).toISOString(),
              warranty_start_date: new Date(dates.startDate).toISOString(),
              warranty_end_date: new Date(dates.endDate).toISOString(),
              warranty_duration_months: formData.warrantyPeriod,
              notes: null,
            }])
          }
        }
      }

      setSuccessMessage('تم تحديث الشهادة بنجاح!')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: unknown) {
      console.error('Error updating warranty:', error)
      const errorMessage = error instanceof Error ? error.message : 'يرجى التحقق من اتصال قاعدة البيانات'
      setErrorMessage(`خطأ في تحديث الشهادة: ${errorMessage}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-bounce-in">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center animate-slide-in-right">
                <div className="p-2 bg-blue-100 rounded-lg mr-3 animate-pulse-slow">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                تعديل بيانات الشهادة
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
        
          <CardContent className="p-6">
            <MessageDisplay 
              successMessage={successMessage} 
              errorMessage={errorMessage} 
            />

            <div className="space-y-8">
              <CustomerInfoSection
                formData={{
                  customerName: formData.customerName,
                  phoneNumber: formData.phoneNumber,
                  invoiceNumber: formData.invoiceNumber
                }}
                onInputChange={handleInputChange}
              />

              <WarrantyPeriodSection
                warrantyPeriod={formData.warrantyPeriod}
                onWarrantyPeriodChange={handleWarrantyPeriodChange}
              />

              <ProductSelectionSection
                products={products}
                selectedProducts={formData.selectedProducts}
                onProductToggle={handleProductToggle}
              />

              <ActionButtons
                onClose={onClose}
                onSave={handleSave}
                isSaving={updateCustomerMutation.isPending || updateWarrantyMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
