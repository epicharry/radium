import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer } from '../components/Toast'
import { DEFAULT_DURATION } from '../constants'
import type { Toast, ToastType } from '../types'

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => number
  success: (message: string, duration?: number) => number
  error: (message: string, duration?: number) => number
  warning: (message: string, duration?: number) => number
  info: (message: string, duration?: number) => number
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = DEFAULT_DURATION): number => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type, duration }])
      return id
    },
    []
  )

  const value: ToastContextType = {
    showToast,
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}
