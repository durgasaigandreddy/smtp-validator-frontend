export type Verdict = 'valid' | 'invalid' | 'catch_all' | 'unknown'

export interface VerdictCounts {
  valid: number
  invalid: number
  catch_all: number
  unknown: number
}

export interface ProviderBreakdown extends VerdictCounts {
  provider: string
}

export interface JobSummary {
  id: number
  name: string
  total: number
  finished: boolean
  created_at: string
}

export interface JobDetail extends JobSummary {
  done: number
  pending: number
  verdicts: VerdictCounts
  by_provider: ProviderBreakdown[]
}

export interface CreatedJob {
  job_id: number
  total: number
}

export interface EmailResult {
  email: string
  verdict: Verdict
  reason: string
  provider: string
  checked_at: string
}
