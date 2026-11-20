import { useMutation } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestBlob } from '../core/request'

export const useDownloadResults = () => {
  const apiKey = useApiKey()

  return useMutation({
    mutationFn: (jobId: number) => requestBlob(`/v1/jobs/${jobId}/results.csv`, { apiKey }),
  })
}
