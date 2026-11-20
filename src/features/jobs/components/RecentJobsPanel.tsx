import { Badge } from '../../../components/Badge'
import { Button } from '../../../components/Button'
import { Cell, DataTable, Row } from '../../../components/DataTable'
import { EmptyState } from '../../../components/EmptyState'
import { Panel } from '../../../components/Panel'
import { QueryBoundary } from '../../../components/QueryBoundary'
import { formatCount, formatRelativeDay } from '../../../lib/format'
import { useListJobs } from '../../../api'
import { useSaveResults } from '../useSaveResults'

export const RecentJobsPanel = ({ onOpenJob }: { onOpenJob: (jobId: number) => void }) => {
  const { data: jobs, isPending, error } = useListJobs()
  const { save, isSaving } = useSaveResults()

  return (
    <Panel title="Recent jobs" delay={240}>
      <QueryBoundary isLoading={isPending} error={error}>
        {jobs?.length === 0 ? (
          <EmptyState title="No jobs yet" hint="Upload a CSV above to start your first check." />
        ) : (
          <DataTable headers={['Job', 'Name', 'Addresses', 'Status', 'Started', '']}>
            {jobs?.map((job) => (
              <Row key={job.id}>
                <Cell className="numeric text-ink-soft">#{job.id}</Cell>
                <Cell className="font-medium break-all">{job.name}</Cell>
                <Cell className="numeric">{formatCount(job.total)}</Cell>
                <Cell>
                  {job.finished ? (
                    <Badge tone="valid">Finished</Badge>
                  ) : (
                    <Badge tone="warn" withDot pulse>
                      Running
                    </Badge>
                  )}
                </Cell>
                <Cell className="text-ink-soft">{formatRelativeDay(job.created_at)}</Cell>
                <Cell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="small" onClick={() => onOpenJob(job.id)}>
                      Open
                    </Button>
                    {job.finished && (
                      <Button
                        variant="quiet"
                        size="small"
                        disabled={isSaving}
                        onClick={() => save(job.id)}
                      >
                        Download
                      </Button>
                    )}
                  </div>
                </Cell>
              </Row>
            ))}
          </DataTable>
        )}
      </QueryBoundary>
    </Panel>
  )
}
