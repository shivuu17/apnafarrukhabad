import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Modal Component
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeOnBackdropClick && onClose()}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`${sizes[size]} w-full bg-white rounded-2xl shadow-xl pointer-events-auto max-h-[90vh] overflow-y-auto`}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 sticky top-0 bg-white rounded-t-2xl">
                  <h2 className="text-xl font-bold">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-neutral-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {footer && <div className="border-t border-neutral-200 p-6 bg-neutral-50 rounded-b-2xl">{footer}</div>}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Bottom Sheet Modal
export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showHandle = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 rounded-full bg-neutral-300" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-200">
                <h2 className="text-lg font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-neutral-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            {footer && <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Drawer Component (side drawer)
export const Drawer = ({
  isOpen,
  onClose,
  position = 'left',
  title,
  children,
  width = 'w-80'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const directionClass = position === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={position === 'left' ? { x: '-100%' } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={position === 'left' ? { x: '-100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className={`fixed top-0 ${position}-0 h-full ${width} bg-white shadow-2xl z-50 overflow-y-auto`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 sticky top-0 bg-white">
              {title && <h2 className="text-lg font-bold">{title}</h2>}
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-100 rounded-lg transition ml-auto"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Confirmation Dialog
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  loading = false
}) => {
  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200'
  }

  const typeIcons = {
    info: '💡',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" closeOnBackdropClick={!loading}>
      <div className={`p-4 rounded-lg border ${typeColors[type]} mb-6`}>
        <p className="flex items-center gap-3 text-sm">
          <span className="text-2xl">{typeIcons[type]}</span>
          {message}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 font-semibold hover:bg-neutral-50 transition disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? '...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}

// Toast / Notification
export const Toast = ({ message, type = 'info', onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  const typeColors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${typeColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4`}
    >
      {message}
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

// Toast Container (for managing multiple toasts)
export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
            autoClose={toast.autoClose}
          />
        </div>
      ))}
    </AnimatePresence>
  </div>
)

// Action Sheet
export const ActionSheet = ({ isOpen, onClose, title, actions = [] }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-2">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => {
            action.onClick?.()
            onClose()
          }}
          className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
            action.variant === 'danger'
              ? 'text-red-600 hover:bg-red-50'
              : 'text-green-600 hover:bg-green-50'
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  </BottomSheet>
)

export default {
  Modal,
  BottomSheet,
  Drawer,
  ConfirmDialog,
  Toast,
  ToastContainer,
  ActionSheet
}
