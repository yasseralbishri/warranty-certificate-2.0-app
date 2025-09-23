import { X, Printer, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WarrantyFormData } from '@/types'
import type { Product } from '@/types'
import { formatDate, formatPhoneNumber, calculateWarrantyEndDate } from '@/lib/utils'

// PDF-specific Logo Component
function PDFLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="text-center">
        {/* Logo Image */}
        <div className="flex justify-center mb-2">
          <img 
            src="/images/alsweed-logo.png" 
            alt="السويد - alsweed"
            className="w-32 h-32 object-contain"
            style={{
              aspectRatio: '1/1',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center">
                  </div>
                `
              }
            }}
          />
        </div>
        
        {/* Company Text */}
        <div className="text-center">
        </div>
      </div>
    </div>
  )
}

interface CertificateGeneratorProps {
  warrantyData: WarrantyFormData
  products: Product[]
  onClose: () => void
}

export function CertificateGenerator({ warrantyData, products, onClose }: CertificateGeneratorProps) {
  const selectedProducts = products.filter(product => 
    warrantyData.selectedProducts.includes(product.id)
  )

  const handlePrint = () => {
    const certificateElement = document.querySelector('.certificate-container');
    if (!certificateElement) return;

    const printHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>شهادة الضمان</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: white !important;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box;
          }
          .certificate-container {
            width: 794px !important;
            height: 1123px !important;
            max-width: 794px !important;
            max-height: 1123px !important;
            min-height: 1123px !important;
            box-sizing: border-box;
            border: none !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          .certificate-container * {
            page-break-inside: avoid !important;
          }
        </style>
        <link rel="stylesheet" href="${window.location.origin}/src/index.css">
      </head>
      <body>
        ${certificateElement.outerHTML}
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.write(printHTML);
    iframeDoc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 50); // Small delay to ensure styles are applied
    };
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="text-white p-6" style={{backgroundColor: '#0033cc'}}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">شهادة الضمان</h2>
                <p className="text-sm mt-1" style={{color: 'rgba(255, 255, 255, 0.8)'}}>عرض وطباعة الشهادة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                onClick={handlePrint}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 px-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex-1 sm:flex-none animate-float"
              >
                <Printer className="h-5 w-5 ml-2" />
                <span className="hidden sm:inline">طباعة الشهادة</span>
                <span className="sm:hidden">طباعة</span>
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="h-12 w-12 rounded-xl border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:border-white/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                title="إغلاق"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Certificate Content Area */}
        <div className="p-6 bg-gray-50 overflow-auto max-h-[calc(95vh-120px)]">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-4xl">
          <div 
            className="certificate-container bg-white border-2 border-[#0033cc] p-4 max-w-4xl mx-auto"
            dir="rtl"
            style={{
              fontFamily: "inherit",
              width: '794px',
              height: '1123px'
            }}
          >


            {/* Company Logo and Header */}
            <div className="flex justify-center items-center mb-4">
              <div className="bg-white p-3 rounded-full border-2 border-[#0033cc]">
                <PDFLogo />
              </div>
            </div>

            {/* Certificate Header */}
            <div className="text-center mb-6">
              <div className="inline-block bg-[#0033cc] text-white px-6 py-3 rounded-lg mb-3">
                <h1 className="text-2xl font-bold">
                  شهادة الضمان
                </h1>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4">
              <div className="bg-gray-50 p-3 border-l-4 border-[#0033cc] border border-gray-200">
                <h2 className="text-lg font-bold text-[#0033cc] mb-3 flex items-center">
                  <div className="w-6 h-6 bg-[#0033cc] rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">1</div>
                  معلومات العميل
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 font-medium">اسم العميل</p>
                    <p className="text-sm font-bold text-gray-800">{warrantyData.customerName}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 font-medium">رقم الهاتف</p>
                    <p className="text-sm font-bold text-gray-800">{formatPhoneNumber(warrantyData.phoneNumber)}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 font-medium">رقم الفاتورة</p>
                    <p className="text-sm font-bold text-gray-800">{warrantyData.invoiceNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Covered */}
            <div className="mb-4">
              <div className="bg-gray-50 p-3 border-l-4 border-[#0033cc] border border-gray-200">
                <h2 className="text-lg font-bold text-[#0033cc] mb-3 flex items-center">
                  <div className="w-6 h-6 bg-[#0033cc] rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">2</div>
                  الشركات المشمولة
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="bg-white p-2 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-[#0033cc] text-white rounded-full flex items-center justify-center text-xs font-bold ml-2 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-gray-600 text-xs leading-tight">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warranty Terms */}
            <div className="mb-4">
              <div className="bg-gray-50 p-3 border-l-4 border-[#0033cc] border border-gray-200">
                <h2 className="text-lg font-bold text-[#0033cc] mb-3 flex items-center">
                  <div className="w-6 h-6 bg-[#0033cc] rounded-full flex items-center justify-center text-white text-xs font-bold ml-2">3</div>
                  معلومات الضمان
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <p className="font-medium text-gray-700">مدة الضمان</p>
                    <p className="text-lg font-bold" style={{color: '#0033cc'}}>{warrantyData.warrantyPeriod} شهر</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <p className="font-medium text-gray-700">تاريخ النهاية</p>
                    <p className="text-lg font-bold" style={{color: '#0033cc'}}>
                      {formatDate(calculateWarrantyEndDate(new Date(), warrantyData.warrantyPeriod))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t-2 border-gray-300">
              <p className="text-gray-600 text-sm">
                هذه الشهادة صادرة من شركة السويد للسباكة التجارية
              </p>
            </div>

          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}