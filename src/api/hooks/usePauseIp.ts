import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestEmpty } from '../core/request'
import { getAdminStatusKey } from './useGetAdminStatus'
import { listAuditEntriesKey } from './useListAuditEntries'

export const usePauseIp = () => {
  const apiKey = useApiKey()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ip: string) =>
      requestEmpty(`/admin/ips/${encodeURIComponent(ip)}/pause`, { apiKey, method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAdminStatusKey })
      queryClient.invalidateQueries({ queryKey: listAuditEntriesKey })
    },
  })
}
