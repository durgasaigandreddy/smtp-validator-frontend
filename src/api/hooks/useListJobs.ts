import { useQuery } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { JobSummary } from '../types'

export const listJobsKey = ['jobs'] as const

export const useListJobs = () => {
  const apiKey = useApiKey()

  return useQuery({
    queryKey: listJobsKey,
    queryFn: () => requestJson<JobSummary[]>('/v1/jobs', { apiKey }),
  })
}
