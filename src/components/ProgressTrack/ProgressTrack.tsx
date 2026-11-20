interface ProgressTrackProps {
  fraction: number
  label: string
  animated?: boolean
  height?: number
}

export const ProgressTrack = ({
  fraction,
  label,
  animated = false,
  height = 8,
}: ProgressTrackProps) => (
  <div
    role="progressbar"
    aria-label={label}
    aria-valuenow={Math.round(fraction * 100)}
    aria-valuemin={0}
    aria-valuemax={100}
    className="w-full overflow-hidden rounded-full bg-track"
    style={{ height }}
  >
    <div
      className={`relative h-full overflow-hidden rounded-full transition-[width] duration-700 ease-out ${
        animated ? 'animate-sheen' : ''
      }`}
      style={{
        width: `${Math.min(100, Math.max(0, fraction * 100))}%`,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
      }}
    />
  </div>
)
