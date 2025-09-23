import React, { memo } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActionButtonsProps {
  onClose: () => void
  onSave: () => void
  isSaving: boolean
}

export const ActionButtons = memo(function ActionButtons({
  onClose,
  onSave,
  isSaving
}: ActionButtonsProps) {
  return (
    <div className="pt-8 border-t border-gray-200 animate-fade-in">
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-14 px-12 text-lg font-bold rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          إلغاء
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-14 px-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 border-0 animate-float"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 ml-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </div>
  )
})
