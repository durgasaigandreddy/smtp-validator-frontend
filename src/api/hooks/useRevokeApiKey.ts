import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestEmpty } from '../core/request'
import { listApiKeysKey } from './useListApiKeys'
import { listAuditEntriesKey } from './useListAuditEntries'

export const useRevokeApiKey = () => {
  const apiKey = useApiKey()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (keyId: number) => requestEmpty(`/admin/keys/${keyId}`, { apiKey, method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listApiKeysKey })
      queryClient.invalidateQueries({ queryKey: listAuditEntriesKey })
    },
  })
}
