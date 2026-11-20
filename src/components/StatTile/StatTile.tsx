import type { ReactNode } from 'react'
import { useCountUp } from '../../lib/useCountUp'
import { formatCompact } from '../../lib/format'

interface StatTileProps {
  label: string
  value: number
  caption?: ReactNode
  delay?: number
}

export const StatTile = ({ label, value, caption, delay = 0 }: StatTileProps) => {
  const displayed = useCountUp(value)

  return (
    <div
      className="glass animate-rise relative overflow-hidden rounded-2xl p-5 shadow-low"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent-bright), transparent)' }}
      />
      <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">{label}</p>
      <p className="numeric mt-2 text-[32px] leading-none font-semibold tracking-tight">
        {formatCompact(displayed)}
      </p>
      {caption && <div className="mt-2 text-[12px] text-ink-soft">{caption}</div>}
    </div>
  )
}
