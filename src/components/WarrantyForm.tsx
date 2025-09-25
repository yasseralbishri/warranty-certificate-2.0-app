import { useState, useCallback, memo } from 'react'
import { Save, Loader2, CheckCircle, AlertCircle, User, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useCreateWarranty, useProducts } from '@/hooks/useWarranties'
import { CertificateGenerator } from './CertificateGenerator'
import { SupabaseSetupAlert } from './SupabaseSetupAlert'
import { sanitizeInput } from '@/lib/utils'
import { useSecureAuth } from '@/contexts/SecureAuthContext'

export const WarrantyForm = memo(function WarrantyForm() {
  console.log('🔄 [WarrantyForm] بدء تحميل نموذج الضمان...')
  
  // All hooks must be declared at the top before any conditional logic
  const [showCertificate, setShowCertificate] = useState(false)
  const [savedWarrantyData, setSavedWarrantyData] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    invoiceNumber: '',
    warrantyPeriod: 12,
    warrantyDuration: 'per_product' as const,
    selectedProducts: [] as string[]
  })
  
  // All custom hooks must also be at the top
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts()
  const createWarrantyMutation = useCreateWarranty()
  const { user } = useSecureAuth()
  const { toast } = useToast()
  
  console.log('📊 [WarrantyForm] حالة البيانات:', {
    products: products,
    productsLength: products?.length || 0,
    productsLoading: productsLoading,
    productsError: productsError,
    user: user,
    formData: formData,
    createWarrantyMutation: {
      isLoading: createWarrantyMutation.isLoading,
      isError: createWarrantyMutation.isError,
      error: createWarrantyMutation.error
    }
  })


  const handleInputChange = useCallback((field: string, value: any) => {
    // Sanitize string inputs for security
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }))
  }, [])

  const handleProductToggle = useCallback((productId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: checked 
        ? [...prev.selectedProducts, productId]
        : prev.selectedProducts.filter(id => id !== productId)
    }))
  }, [])

  const handleSaveClick = async () => {
    console.log('🔄 [WarrantyForm] بدء حفظ النموذج...', formData)
    
    // Clear previous messages
    setErrorMessage(null)
    setSuccessMessage(null)
    
    // Validation
    if (!formData.customerName.trim()) {
      const errorMsg = 'يرجى إدخال اسم العميل'
      setErrorMessage(errorMsg)
      toast({
        title: "خطأ في التحقق",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }
    
    if (!formData.phoneNumber.trim()) {
      const errorMsg = 'يرجى إدخال رقم الهاتف'
      setErrorMessage(errorMsg)
      toast({
        title: "خطأ في التحقق",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }
    
    if (!formData.invoiceNumber.trim()) {
      const errorMsg = 'يرجى إدخال رقم الفاتورة'
      setErrorMessage(errorMsg)
      toast({
        title: "خطأ في التحقق",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }
    
    // اختيار الشركة اختياري - لا نحتاج للتحقق من وجود شركات مختارة
    
    try {
      console.log('🔄 [WarrantyForm] استدعاء createWarrantyMutation...')
      const result = await createWarrantyMutation.mutateAsync({
        ...formData,
        userId: user?.id
      })
      console.log('✅ [WarrantyForm] تم حفظ النموذج بنجاح:', result)
      
      setSavedWarrantyData(formData)
      
      // رسالة مختلفة حسب وجود شركات مختارة أم لا
      if (formData.selectedProducts.length > 0) {
        toast({
          title: "تم حفظ الضمان بنجاح!",
          description: "يمكنك الآن طباعة الشهادة.",
          variant: "success",
        })
        setSuccessMessage('تم حفظ الضمان بنجاح! يمكنك الآن طباعة الشهادة.')
        setShowCertificate(true)
      } else {
        toast({
          title: "تم حفظ بيانات العميل بنجاح!",
          description: "لم يتم اختيار أي شركة",
          variant: "success",
        })
        setSuccessMessage('تم حفظ بيانات العميل بنجاح! (لم يتم اختيار أي شركة)')
        // لا نعرض الشهادة إذا لم يتم اختيار شركات
      }
      
      // Reset form
      setFormData({
        customerName: '',
        phoneNumber: '',
        invoiceNumber: '',
        warrantyPeriod: 12,
        warrantyDuration: 'per_product' as const,
        selectedProducts: []
      })
      
    } catch (error: any) {
      console.error('💥 [WarrantyForm] خطأ في حفظ النموذج:', error)
      const errorMsg = `خطأ في حفظ الضمان: ${error.message || 'يرجى التحقق من اتصال قاعدة البيانات'}`
      setErrorMessage(errorMsg)
      toast({
        title: "خطأ في الحفظ",
        description: errorMsg,
        variant: "destructive",
      })
    }
  }

  // Conditional rendering - moved to the end to avoid hooks order issues
  if (showCertificate && savedWarrantyData) {
    return (
      <CertificateGenerator
        warrantyData={savedWarrantyData}
        products={products}
        onClose={() => setShowCertificate(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <SupabaseSetupAlert />
        
        
        {/* Success Message */}
        {successMessage && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden animate-bounce-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3 animate-pulse-slow">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-green-800 font-bold text-lg animate-fade-in">{successMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50 rounded-2xl overflow-hidden animate-bounce-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3 animate-pulse-slow">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-red-800 font-bold text-lg animate-fade-in">{errorMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-500">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center animate-slide-in-right">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 animate-pulse-slow">
                <Save className="h-6 w-6 text-blue-600" />
              </div>
              نموذج إنشاء الشهادة
            </CardTitle>
          </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Customer Information Section */}
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
                <div className="p-2 bg-blue-100 rounded-lg animate-pulse-slow">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">معلومات العميل</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    اسم العميل <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="اسم العميل"
                    className="h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="رقم الهاتف"
                    className="h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  رقم الفاتورة <span className="text-red-500">*</span>
                </label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  placeholder="رقم الفاتورة"
                  className="h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Company Selection Section */}
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
                <div className="p-2 bg-purple-100 rounded-lg animate-pulse-slow">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">الشركات المشمولة (اختياري)</h3>
              </div>
              
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                💡 يمكنك اختيار الشركات التي تريد تضمينها في الضمان، أو تركها فارغة إذا لم تكن بحاجة لضمانات محددة
              </p>
              
              {productsLoading ? (
                <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="mr-3 text-gray-600">جاري تحميل الشركات...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-red-700 font-medium">لا توجد شركات متاحة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(products as any[]).map((product) => (
                    <div 
                      key={product.id} 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.selectedProducts.includes(product.id) 
                          ? 'bg-gray-50 border-blue-600' 
                          : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-300'
                      }`}
                      onClick={() => handleProductToggle(product.id, !formData.selectedProducts.includes(product.id))}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                          formData.selectedProducts.includes(product.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {formData.selectedProducts.includes(product.id) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="text-gray-600 text-sm">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warranty Period Section */}
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
                <div className="p-2 bg-green-100 rounded-lg animate-pulse-slow">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">فترة الضمان</h3>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  مدة الضمان (بالأشهر) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="warrantyPeriod"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.warrantyPeriod}
                  onChange={(e) => handleInputChange('warrantyPeriod', parseInt(e.target.value) || 12)}
                  placeholder="مدة الضمان"
                  className="h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Action Button Section */}
            <div className="pt-8 border-t border-gray-200 animate-fade-in">
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={createWarrantyMutation.isPending}
                  className="h-14 px-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 border-0 animate-float"
                >
                  {createWarrantyMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      إنشاء شهادة الضمان
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
})