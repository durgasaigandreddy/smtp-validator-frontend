import type { JobDetail } from '../../../api'
import { formatCount, formatPercent } from '../../../lib/format'
import { verdictOrder, verdictPresentation } from '../../../lib/verdicts'

export const VerdictLegend = ({ job }: { job: JobDetail }) => (
  <ul className="grid flex-1 gap-2.5">
    {verdictOrder.map((verdict) => {
      const presentation = verdictPresentation[verdict]
      const count = job.verdicts[verdict]
      const share = job.done > 0 ? count / job.done : 0

      return (
        <li
          key={verdict}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-surface-sunken"
        >
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: presentation.color }}
          />
          <span className="flex-1">
            <span className="text-[14px] font-semibold">{presentation.label}</span>
            <span className="block text-[12px] text-ink-soft">{presentation.meaning}</span>
          </span>
          <span className="numeric text-right">
            <span className="block text-[15px] font-semibold">{formatCount(count)}</span>
            <span className="block text-[12px] text-ink-faint">{formatPercent(share)}</span>
          </span>
        </li>
      )
    })}
  </ul>
)
