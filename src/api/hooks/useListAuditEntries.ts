import { useQuery } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { AuditEntry } from '../types'

const REFRESH_INTERVAL_MS = 10_000

const DEFAULT_LIMIT = 6

export const listAuditEntriesKey = ['admin', 'audit'] as const

export const useListAuditEntries = (limit = DEFAULT_LIMIT) => {
  const apiKey = useApiKey()

  return useQuery({
    queryKey: [...listAuditEntriesKey, limit],
    queryFn: () => requestJson<AuditEntry[]>(`/admin/audit?limit=${limit}`, { apiKey }),
    refetchInterval: REFRESH_INTERVAL_MS,
  })
}
