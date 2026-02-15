'use client'

import { useEffect } from 'react'

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false
}) {

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
        
        <h2 className="text-lg font-semibold text-gray-800">
          {title}
        </h2>

        <p className="mt-2 text-gray-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          
          {/* Cancel */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          {/* Confirm */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirmText}
          </button>

        </div>
      </div>

    </div>
  )
}