export type IpState = 'active' | 'paused'

export interface SendingIp {
  ip: string
  state: IpState
  pause_reason: string | null
  used_today: number
  daily_limit: number
  warmup_day: number | null
  block_rate_60m: number
  blacklists: string[]
  worker_alive: boolean
  last_seen: string
}

export interface AdminStatus {
  queued: number
  running: number
  checked_today: number
  ips: SendingIp[]
}
