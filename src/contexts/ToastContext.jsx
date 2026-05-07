import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ToastContainer } from '../components/ui'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', autoClose = true) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((t) => [...t, { id, message, type, autoClose }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  useEffect(() => {
    // Expose a global helper for quick wiring from older components
    // Prefer using the context via hook in new components.
    window.apnaShowToast = (msg, type = 'success') => showToast(msg, type)
    return () => {
      try {
        delete window.apnaShowToast
      } catch (e) {}
    }
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastContext
