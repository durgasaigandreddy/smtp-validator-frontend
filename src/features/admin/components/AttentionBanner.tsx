import type { SendingIp } from '../../../api'
import { Callout } from '../../../components/Callout'
import { formatMinutesElapsed } from '../../../lib/format'

const describe = (ip: SendingIp) =>
  ip.blacklists.length > 0
    ? `${ip.ip} is blacklisted (${ip.blacklists.join(', ')}) and resumes by itself once clean.`
    : `${ip.ip} has had no heartbeat for ${formatMinutesElapsed(ip.last_seen)}.`

export const AttentionBanner = ({ ips }: { ips: SendingIp[] }) => {
  const needingAttention = ips.filter((ip) => ip.blacklists.length > 0 || !ip.worker_alive)

  if (needingAttention.length === 0) return null

  return (
    <Callout role="alert">
      <strong>
        {needingAttention.length} {needingAttention.length === 1 ? 'IP needs' : 'IPs need'} attention.
      </strong>{' '}
      {needingAttention.map(describe).join(' ')}
    </Callout>
  )
}
