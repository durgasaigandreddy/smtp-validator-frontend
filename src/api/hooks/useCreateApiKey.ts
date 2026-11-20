import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { CreatedApiKey } from '../types'
import { listApiKeysKey } from './useListApiKeys'
import { listAuditEntriesKey } from './useListAuditEntries'

export interface NewApiKey {
  name: string
  admin: boolean
}

export const useCreateApiKey = () => {
  const apiKey = useApiKey()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: NewApiKey) =>
      requestJson<CreatedApiKey>('/admin/keys', { apiKey, method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listApiKeysKey })
      queryClient.invalidateQueries({ queryKey: listAuditEntriesKey })
    },
  })
}
