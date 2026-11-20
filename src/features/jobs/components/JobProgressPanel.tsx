import { Badge } from '../../../components/Badge'
import { Button } from '../../../components/Button'
import { DonutChart } from '../../../components/DonutChart'
import { Panel } from '../../../components/Panel'
import { ProgressTrack } from '../../../components/ProgressTrack'
import { QueryBoundary } from '../../../components/QueryBoundary'
import { formatCount, formatPercent } from '../../../lib/format'
import { verdictOrder, verdictPresentation } from '../../../lib/verdicts'
import { useGetJob } from '../../../api'
import { useSaveResults } from '../useSaveResults'
import { ProviderBreakdownTable } from './ProviderBreakdownTable'
import { VerdictLegend } from './VerdictLegend'

export const JobProgressPanel = ({ jobId }: { jobId: number }) => {
  const { data: job, isPending, error } = useGetJob(jobId)
  const { save, isSaving, error: saveError } = useSaveResults()

  return (
    <Panel delay={180}>
      <QueryBoundary isLoading={isPending} error={error}>
        {job && (
          <>
            <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Job #{job.id} · <span className="text-ink-soft">{job.name}</span>
                </h2>
                <p className="numeric mt-1 text-[13px] text-ink-soft">
                  {formatCount(job.done)} of {formatCount(job.total)} checked
                </p>
              </div>
              {job.finished ? (
                <Badge tone="valid" withDot>
                  Finished
                </Badge>
              ) : (
                <Badge tone="warn" withDot pulse>
                  Running
                </Badge>
              )}
            </header>

            <ProgressTrack
              fraction={job.total > 0 ? job.done / job.total : 0}
              label={`${formatPercent(job.total > 0 ? job.done / job.total : 0)} checked`}
              animated={!job.finished}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-7 sm:justify-start">
              <DonutChart
                slices={verdictOrder.map((verdict) => ({
                  label: verdictPresentation[verdict].label,
                  value: job.verdicts[verdict],
                  color: verdictPresentation[verdict].color,
                }))}
                centerValue={formatCount(job.done)}
                centerLabel="checked"
              />
              <VerdictLegend job={job} />
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">
                By provider
              </h3>
              <ProviderBreakdownTable job={job} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="quiet" disabled={isSaving || job.done === 0} onClick={() => save(job.id)}>
                {isSaving ? 'Preparing…' : 'Download results (CSV)'}
              </Button>
              {saveError && <span className="text-[13px] text-danger">{saveError.message}</span>}
            </div>
          </>
        )}
      </QueryBoundary>
    </Panel>
  )
}
