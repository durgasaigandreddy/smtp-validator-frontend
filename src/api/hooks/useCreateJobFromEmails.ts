import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { CreatedJob } from '../types'
import { listJobsKey } from './useListJobs'

export interface NewJobFromEmails {
  emails: string[]
  name?: string
  webhookUrl?: string
}

export const useCreateJobFromEmails = () => {
  const apiKey = useApiKey()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ emails, name, webhookUrl }: NewJobFromEmails) =>
      requestJson<CreatedJob>('/v1/jobs', {
        apiKey,
        method: 'POST',
        body: { emails, name, webhook_url: webhookUrl },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: listJobsKey }),
  })
}
