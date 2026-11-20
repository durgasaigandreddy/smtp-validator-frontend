import type { AdminStatus } from '../../../api'
import { StatTile } from '../../../components/StatTile'

export const SummaryTiles = ({ status }: { status: AdminStatus }) => {
  const activeIps = status.ips.filter((ip) => ip.state === 'active' && ip.worker_alive).length
  const capacityToday = status.ips.reduce((total, ip) => total + ip.daily_limit, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Waiting in queue" value={status.queued} caption="addresses not yet checked" delay={0} />
      <StatTile label="Running now" value={status.running} caption="jobs in progress" delay={70} />
      <StatTile
        label="Checked today"
        value={status.checked_today}
        caption={`of ${capacityToday.toLocaleString('en-GB')} daily capacity`}
        delay={140}
      />
      <StatTile
        label="Sending IPs live"
        value={activeIps}
        caption={`of ${status.ips.length} configured`}
        delay={210}
      />
    </div>
  )
}
