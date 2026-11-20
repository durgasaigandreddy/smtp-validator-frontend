import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { CreatedJob } from '../types'
import { listJobsKey } from './useListJobs'

export interface NewJobFromCsv {
  file: File
  webhookUrl?: string
}

export const useCreateJobFromCsv = () => {
  const apiKey = useApiKey()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, webhookUrl }: NewJobFromCsv) => {
      const body = new FormData()
      body.append('file', file)
      if (webhookUrl) body.append('webhook_url', webhookUrl)
      return requestJson<CreatedJob>('/v1/jobs/upload', { apiKey, method: 'POST', body })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: listJobsKey }),
  })
}
