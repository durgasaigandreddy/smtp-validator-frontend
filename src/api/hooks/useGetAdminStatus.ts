import { useQuery } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { AdminStatus } from '../types'
import { adminStatusPath } from './useVerifyApiKey'

const REFRESH_INTERVAL_MS = 10_000

export const getAdminStatusKey = ['admin', 'status'] as const

export const useGetAdminStatus = () => {
  const apiKey = useApiKey()

  return useQuery({
    queryKey: getAdminStatusKey,
    queryFn: () => requestJson<AdminStatus>(adminStatusPath, { apiKey }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
