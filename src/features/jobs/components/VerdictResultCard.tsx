import type { EmailResult } from '../../../api'
import { formatRelativeDay } from '../../../lib/format'
import { verdictPresentation } from '../../../lib/verdicts'

export const VerdictResultCard = ({ result }: { result: EmailResult }) => {
  const presentation = verdictPresentation[result.verdict]

  return (
    <div
      className="animate-rise mt-4 rounded-xl p-4"
      style={{ background: presentation.background }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: 'var(--surface-raised)', color: presentation.color }}
        >
          {presentation.label}
        </span>
        <strong className="break-all">{result.email}</strong>
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">
        {result.provider} · checked {formatRelativeDay(result.checked_at)} · {result.reason}
      </p>
    </div>
  )
}
