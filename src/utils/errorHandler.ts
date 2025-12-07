import type { ApiError } from '../types'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
  }
}

export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`[Error${context ? ` - ${context}` : ''}]`, {
    message: errorMessage,
    stack: errorStack,
    error,
  })
}
