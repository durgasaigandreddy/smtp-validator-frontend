interface UsageMeterProps {
  used: number
  limit: number
  caption: string
  tone?: 'accent' | 'warn' | 'invalid'
}

const fills: Record<NonNullable<UsageMeterProps['tone']>, string> = {
  accent: 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
  warn: 'var(--warn)',
  invalid: 'var(--invalid)',
}

export const UsageMeter = ({ used, limit, caption, tone = 'accent' }: UsageMeterProps) => {
  const fraction = limit > 0 ? Math.min(1, used / limit) : 0

  return (
    <div className="min-w-[132px]">
      <div className="numeric mb-1.5 text-[13px] font-medium">{caption}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${fraction * 100}%`, background: fills[tone] }}
        />
      </div>
    </div>
  )
}
