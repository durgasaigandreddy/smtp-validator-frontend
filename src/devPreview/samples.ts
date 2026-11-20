import type {
  ApiKeySummary,
  AuditEntry,
  JobDetail,
  ProviderBreakdown,
  SendingIp,
  VerdictCounts,
} from '../api/types'

interface SampleJob {
  id: number
  name: string
  total: number
  startedAt: number
  checksPerSecond: number
}

const minutesAgo = (minutes: number) => Date.now() - minutes * 60_000

const verdictShare = { valid: 0.61, invalid: 0.2, catch_all: 0.09 }

const providerShare: Record<string, number> = {
  Google: 0.42,
  Microsoft: 0.3,
  Yahoo: 0.12,
  Other: 0.16,
}

export const samples = {
  nextJobId: 8,
  nextKeyId: 4,

  jobs: [
    { id: 7, name: 'march-list.csv', total: 1000, startedAt: minutesAgo(2), checksPerSecond: 4 },
    { id: 6, name: 'newsletter.csv', total: 12_480, startedAt: minutesAgo(1_440), checksPerSecond: 40 },
    { id: 5, name: 'webinar-leads', total: 2310, startedAt: minutesAgo(7_200), checksPerSecond: 40 },
  ] as SampleJob[],

  ips: [
    { ip: '203.0.113.10', state: 'active', pause_reason: null, used_today: 612, daily_limit: 1500, warmup_day: null, block_rate_60m: 0.04, blacklists: [], worker_alive: true, last_seen: new Date().toISOString() },
    { ip: '203.0.113.11', state: 'active', pause_reason: null, used_today: 1500, daily_limit: 1500, warmup_day: null, block_rate_60m: 0.07, blacklists: [], worker_alive: true, last_seen: new Date().toISOString() },
    { ip: '203.0.113.12', state: 'paused', pause_reason: 'high block rate', used_today: 310, daily_limit: 1500, warmup_day: null, block_rate_60m: 0.41, blacklists: [], worker_alive: true, last_seen: new Date(minutesAgo(1)).toISOString() },
    { ip: '203.0.113.13', state: 'active', pause_reason: null, used_today: 88, daily_limit: 273, warmup_day: 30, block_rate_60m: 0.02, blacklists: [], worker_alive: true, last_seen: new Date().toISOString() },
    { ip: '203.0.113.14', state: 'paused', pause_reason: 'blacklisted', used_today: 0, daily_limit: 1500, warmup_day: null, block_rate_60m: 0, blacklists: ['zen.spamhaus.org'], worker_alive: true, last_seen: new Date(minutesAgo(1)).toISOString() },
    { ip: '203.0.113.15', state: 'active', pause_reason: null, used_today: 402, daily_limit: 1500, warmup_day: null, block_rate_60m: 0.05, blacklists: [], worker_alive: false, last_seen: new Date(minutesAgo(12)).toISOString() },
  ] as SendingIp[],

  apiKeys: [
    { id: 1, name: 'Admin', is_admin: true, active: true, created_at: new Date(minutesAgo(1_440)).toISOString() },
    { id: 2, name: 'Client app', is_admin: false, active: true, created_at: new Date(minutesAgo(1_440)).toISOString() },
    { id: 3, name: 'Old CRM', is_admin: false, active: false, created_at: new Date(minutesAgo(72_000)).toISOString() },
  ] as ApiKeySummary[],

  audit: [
    { id: 1, at: new Date(minutesAgo(4)).toISOString(), key_name: 'Client app', action: 'Created job #7', source_ip: '192.168.1.20' },
    { id: 2, at: new Date(minutesAgo(31)).toISOString(), key_name: 'Admin', action: 'Paused IP 203.0.113.12', source_ip: '10.8.0.2' },
    { id: 3, at: new Date(minutesAgo(48)).toISOString(), key_name: 'Client app', action: 'Downloaded job #6', source_ip: '192.168.1.20' },
    { id: 4, at: new Date(minutesAgo(75)).toISOString(), key_name: 'unknown', action: 'Sign-in failed (wrong key)', source_ip: '192.168.1.77' },
    { id: 5, at: new Date(minutesAgo(104)).toISOString(), key_name: 'Admin', action: 'Created key "Client app"', source_ip: '10.8.0.2' },
  ] as AuditEntry[],
}

export const addSampleJob = (name: string, total: number) => {
  const job: SampleJob = {
    id: samples.nextJobId++,
    name,
    total,
    startedAt: Date.now(),
    checksPerSecond: Math.max(1, Math.round(total / 60)),
  }
  samples.jobs.unshift(job)
  recordSampleAudit('Client app', `Created job #${job.id}`)
  return job
}

export const recordSampleAudit = (keyName: string, action: string) => {
  samples.audit.unshift({
    id: samples.audit.length + 1,
    at: new Date().toISOString(),
    key_name: keyName,
    action,
    source_ip: keyName === 'Admin' ? '10.8.0.2' : '192.168.1.20',
  })
}

export const findSampleJob = (jobId: number) => samples.jobs.find((job) => job.id === jobId)

const splitByVerdict = (count: number): VerdictCounts => {
  const valid = Math.round(count * verdictShare.valid)
  const invalid = Math.round(count * verdictShare.invalid)
  const catchAll = Math.round(count * verdictShare.catch_all)
  return { valid, invalid, catch_all: catchAll, unknown: Math.max(0, count - valid - invalid - catchAll) }
}

const splitByProvider = (counts: VerdictCounts): ProviderBreakdown[] =>
  Object.entries(providerShare).map(([provider, share]) => ({
    provider,
    valid: Math.round(counts.valid * share),
    invalid: Math.round(counts.invalid * share),
    catch_all: Math.round(counts.catch_all * share),
    unknown: Math.round(counts.unknown * share),
  }))

export const toSampleJobDetail = (job: SampleJob): JobDetail => {
  const elapsedSeconds = (Date.now() - job.startedAt) / 1000
  const done = Math.min(job.total, Math.floor(elapsedSeconds * job.checksPerSecond))
  const verdicts = splitByVerdict(done)

  return {
    id: job.id,
    name: job.name,
    total: job.total,
    done,
    pending: job.total - done,
    finished: done >= job.total,
    created_at: new Date(job.startedAt).toISOString(),
    verdicts,
    by_provider: splitByProvider(verdicts),
  }
}
