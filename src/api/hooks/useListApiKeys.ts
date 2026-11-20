import { useQuery } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { ApiKeySummary } from '../types'

export const listApiKeysKey = ['admin', 'keys'] as const

export const useListApiKeys = () => {
  const apiKey = useApiKey()

  return useQuery({
    queryKey: listApiKeysKey,
    queryFn: () => requestJson<ApiKeySummary[]>('/admin/keys', { apiKey }),
  })
}
