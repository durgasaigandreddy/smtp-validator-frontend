import type { CSSProperties } from 'react'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  slices: DonutSlice[]
  centerValue: string
  centerLabel: string
  size?: number
}

const RADIUS = 60
const THICKNESS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const toArcs = (slices: DonutSlice[]) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const scale = total > 0 ? CIRCUMFERENCE / total : 0

  return slices.reduce<{ slice: DonutSlice; length: number; offset: number }[]>((arcs, slice) => {
    const previous = arcs.at(-1)
    const offset = previous ? previous.offset - previous.length : 0
    return [...arcs, { slice, length: slice.value * scale, offset }]
  }, [])
}

export const DonutChart = ({ slices, centerValue, centerLabel, size = 164 }: DonutChartProps) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <svg viewBox="0 0 160 160" className="size-full -rotate-90">
      <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="var(--track)" strokeWidth={THICKNESS} />
      {toArcs(slices).map((arc, index) => (
        <circle
          key={arc.slice.label}
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke={arc.slice.color}
          strokeWidth={THICKNESS}
          strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
          strokeDashoffset={arc.offset}
          className="animate-arc transition-[stroke-dasharray] duration-700"
          style={
            {
              '--arc-length': `${CIRCUMFERENCE}`,
              animationDelay: `${index * 110}ms`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
    <div className="absolute inset-0 grid place-content-center text-center">
      <span className="numeric text-[26px] font-semibold tracking-tight">{centerValue}</span>
      <span className="text-[11px] tracking-[0.08em] text-ink-faint uppercase">{centerLabel}</span>
    </div>
  </div>
)
