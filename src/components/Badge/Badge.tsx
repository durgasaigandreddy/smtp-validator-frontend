import type { ReactNode } from 'react'

export type BadgeTone = 'valid' | 'invalid' | 'warn' | 'neutral' | 'accent'

const tones: Record<BadgeTone, { color: string; background: string }> = {
  valid: { color: 'var(--valid)', background: 'var(--valid-bg)' },
  invalid: { color: 'var(--invalid)', background: 'var(--invalid-bg)' },
  warn: { color: 'var(--warn)', background: 'var(--warn-bg)' },
  neutral: { color: 'var(--neutral)', background: 'var(--neutral-bg)' },
  accent: { color: 'var(--accent)', background: 'var(--accent-glow)' },
}

interface BadgeProps {
  tone: BadgeTone
  children: ReactNode
  withDot?: boolean
  pulse?: boolean
}

export const Badge = ({ tone, children, withDot = false, pulse = false }: BadgeProps) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
    style={tones[tone]}
  >
    {withDot && (
      <span className="relative grid size-1.5 place-items-center">
        <span
          className={`absolute inset-0 rounded-full ${pulse ? 'animate-beacon' : ''}`}
          style={{ background: 'currentColor' }}
        />
      </span>
    )}
    {children}
  </span>
)
