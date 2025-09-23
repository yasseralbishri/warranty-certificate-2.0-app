import { z } from 'zod'

// Phone number validation - more flexible for different formats
const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/

export const warrantyFormSchema = z.object({
  customerName: z.string().min(2, 'يجب أن يكون اسم العميل حرفين على الأقل'),
  phoneNumber: z.string()
    .min(7, 'يجب أن يكون رقم الهاتف 7 أرقام على الأقل')
    .regex(phoneRegex, 'يرجى إدخال رقم هاتف صحيح'),
  invoiceNumber: z.string().min(1, 'رقم الفاتورة مطلوب'),
  selectedProducts: z.array(z.string()).min(1, 'يرجى اختيار شركة واحدة على الأقل'),
  warrantyDuration: z.enum(['per_product', 'per_invoice']),
  warrantyPeriod: z.number().min(1, 'يجب أن تكون مدة الضمان شهر واحد على الأقل').max(60, 'لا يمكن أن تتجاوز مدة الضمان 60 شهراً')
})

export const searchSchema = z.object({
  searchTerm: z.string().min(1, "يرجى إدخال رقم الفاتورة أو رقم الهاتف")
})

export type SearchFormData = z.infer<typeof searchSchema>
