import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api'

const RETRYABLE_ATTEMPTS = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: (attempt, error) => {
        if (error instanceof ApiError && error.status < 500) return false
        return attempt < RETRYABLE_ATTEMPTS
      },
    },
    mutations: { retry: false },
  },
})
