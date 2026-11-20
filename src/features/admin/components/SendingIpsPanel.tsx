import { usePauseIp, useResumeIp, type SendingIp } from '../../../api'
import { Badge } from '../../../components/Badge'
import { Button } from '../../../components/Button'
import { Cell, DataTable, Row } from '../../../components/DataTable'
import { Panel } from '../../../components/Panel'
import { UsageMeter } from '../../../components/UsageMeter'
import { formatCount, formatMinutesSince, formatPercent } from '../../../lib/format'

const HIGH_BLOCK_RATE = 0.3

const StateBadge = ({ ip }: { ip: SendingIp }) => {
  if (!ip.worker_alive) return <Badge tone="invalid" withDot>Worker down</Badge>
  if (ip.state === 'paused') {
    return (
      <Badge tone={ip.blacklists.length > 0 ? 'invalid' : 'warn'} withDot>
        {ip.pause_reason ? `Paused · ${ip.pause_reason}` : 'Paused'}
      </Badge>
    )
  }
  return (
    <Badge tone="valid" withDot pulse>
      Active
    </Badge>
  )
}

const usageCaption = (ip: SendingIp) => {
  const usage = `${formatCount(ip.used_today)} / ${formatCount(ip.daily_limit)}`
  if (ip.warmup_day !== null) return `${usage} · warming up, day ${ip.warmup_day}`
  if (ip.used_today >= ip.daily_limit) return `${usage} · at limit`
  return usage
}

export const SendingIpsPanel = ({ ips }: { ips: SendingIp[] }) => {
  const pauseIp = usePauseIp()
  const resumeIp = useResumeIp()

  const isUpdating = pauseIp.isPending || resumeIp.isPending
  const updateError = pauseIp.error ?? resumeIp.error

  return (
    <Panel
      title="Sending IPs"
      description="One worker per public IP. Pausing stops new checks on that address."
      delay={280}
    >
      <DataTable headers={['IP', 'Status', 'Today', 'Blocked 60m', 'Blacklists', 'Worker', '']}>
        {ips.map((ip) => (
          <Row key={ip.ip}>
            <Cell className="font-mono text-[13px]">{ip.ip}</Cell>
            <Cell>
              <StateBadge ip={ip} />
            </Cell>
            <Cell>
              <UsageMeter
                used={ip.used_today}
                limit={ip.daily_limit}
                caption={usageCaption(ip)}
                tone={ip.used_today >= ip.daily_limit ? 'warn' : 'accent'}
              />
            </Cell>
            <Cell className="numeric font-medium">
              <span
                style={
                  ip.block_rate_60m >= HIGH_BLOCK_RATE ? { color: 'var(--invalid)' } : undefined
                }
              >
                {formatPercent(ip.block_rate_60m)}
              </span>
            </Cell>
            <Cell className="text-[13px]">
              {ip.blacklists.length > 0 ? (
                <span className="text-danger">{ip.blacklists.join(', ')}</span>
              ) : (
                <span className="text-ink-faint">Clean</span>
              )}
            </Cell>
            <Cell className="text-[13px] text-ink-soft">
              {ip.worker_alive ? 'Alive' : formatMinutesSince(ip.last_seen)}
            </Cell>
            <Cell>
              <div className="flex justify-end">
                <Button
                  variant={ip.state === 'paused' ? 'quiet' : 'danger'}
                  size="small"
                  disabled={isUpdating}
                  onClick={() =>
                    ip.state === 'active' ? pauseIp.mutate(ip.ip) : resumeIp.mutate(ip.ip)
                  }
                >
                  {ip.state === 'paused' ? 'Resume' : 'Pause'}
                </Button>
              </div>
            </Cell>
          </Row>
        ))}
      </DataTable>

      {updateError && (
        <p role="alert" className="mt-3 text-[13px] font-medium text-danger">
          {updateError.message}
        </p>
      )}
    </Panel>
  )
}
