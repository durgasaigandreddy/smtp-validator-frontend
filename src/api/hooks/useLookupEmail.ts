import { useMutation } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { EmailResult } from '../types'

export const useLookupEmail = () => {
  const apiKey = useApiKey()

  return useMutation({
    mutationFn: (email: string) =>
      requestJson<EmailResult>(`/v1/result?email=${encodeURIComponent(email)}`, { apiKey }),
  })
}
