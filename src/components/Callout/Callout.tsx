import type { ReactNode } from 'react'

type CalloutTone = 'warn' | 'accent' | 'valid'

const tones: Record<CalloutTone, { color: string; background: string }> = {
  warn: { color: 'var(--warn)', background: 'var(--warn-bg)' },
  accent: { color: 'var(--accent)', background: 'var(--accent-glow)' },
  valid: { color: 'var(--valid)', background: 'var(--valid-bg)' },
}

interface CalloutProps {
  tone?: CalloutTone
  role?: 'alert' | 'status'
  children: ReactNode
  className?: string
}

export const Callout = ({ tone = 'warn', role, children, className = '' }: CalloutProps) => (
  <div
    role={role}
    className={`animate-rise rounded-xl px-4 py-3 text-[13px] ${className}`}
    style={{ background: tones[tone].background, color: tones[tone].color }}
  >
    {children}
  </div>
)

export const FieldError = ({ children }: { children: ReactNode }) =>
  children ? (
    <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
      {children}
    </p>
  ) : null
