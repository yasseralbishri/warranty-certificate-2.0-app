import React, { memo } from 'react'
import { Building2, CheckCircle } from 'lucide-react'
import type { Product } from '@/types'

interface ProductSelectionSectionProps {
  products: Product[]
  selectedProducts: string[]
  onProductToggle: (productId: string, checked: boolean) => void
}

export const ProductSelectionSection = memo(function ProductSelectionSection({
  products,
  selectedProducts,
  onProductToggle
}: ProductSelectionSectionProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center space-x-3 space-x-reverse animate-slide-in-right">
        <div className="p-2 bg-purple-100 rounded-lg animate-pulse-slow">
          <Building2 className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">الشركات المشمولة</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product: Product) => (
          <div 
            key={product.id} 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedProducts.includes(product.id) 
                ? 'bg-gray-50' 
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
            style={{
              borderColor: selectedProducts.includes(product.id) ? '#0033cc' : '',
              '--hover-border-color': '#0033cc'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              if (!selectedProducts.includes(product.id)) {
                e.currentTarget.style.borderColor = 'rgba(0, 51, 204, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedProducts.includes(product.id)) {
                e.currentTarget.style.borderColor = '';
              }
            }}
            onClick={() => onProductToggle(product.id, !selectedProducts.includes(product.id))}
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedProducts.includes(product.id)
                  ? 'border-gray-300'
                  : 'border-gray-300'
              }`}
              style={{
                backgroundColor: selectedProducts.includes(product.id) ? '#0033cc' : '',
                borderColor: selectedProducts.includes(product.id) ? '#0033cc' : ''
              }}>
                {selectedProducts.includes(product.id) && (
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
    </div>
  )
})
