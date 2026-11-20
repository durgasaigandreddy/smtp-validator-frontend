import { useQuery } from '@tanstack/react-query'
import { useApiKey } from '../../auth'
import { requestJson } from '../core/request'
import type { JobDetail } from '../types'

const POLL_INTERVAL_MS = 4000

export const getJobKey = (jobId: number) => ['jobs', jobId] as const

export const useGetJob = (jobId: number | null) => {
  const apiKey = useApiKey()

  return useQuery({
    queryKey: getJobKey(jobId ?? 0),
    queryFn: () => requestJson<JobDetail>(`/v1/jobs/${jobId}`, { apiKey }),
    enabled: jobId !== null,
    refetchInterval: (query) => (query.state.data?.finished ? false : POLL_INTERVAL_MS),
  })
}
