import { Panel } from '../../../components/Panel'
import { QueryBoundary } from '../../../components/QueryBoundary'
import { formatTime } from '../../../lib/format'
import { useListAuditEntries } from '../../../api'

export const ActivityPanel = () => {
  const { data: entries, isPending, error } = useListAuditEntries()

  return (
    <Panel title="Recent activity" delay={400}>
      <QueryBoundary isLoading={isPending} error={error}>
        <ol className="relative grid gap-4 pl-5">
          <span aria-hidden className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-hairline" />
          {entries?.map((entry) => (
            <li key={entry.id} className="relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-5 size-[7px] rounded-full ring-3 ring-[var(--surface-solid)]"
                style={{ background: 'var(--accent)' }}
              />
              <p className="text-[14px]">{entry.action}</p>
              <p className="numeric text-[12px] text-ink-faint">
                {formatTime(entry.at)} · {entry.key_name} · {entry.source_ip}
              </p>
            </li>
          ))}
        </ol>
      </QueryBoundary>
    </Panel>
  )
}
