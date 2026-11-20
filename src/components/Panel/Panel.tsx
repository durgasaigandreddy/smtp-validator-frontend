import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  delay?: number
  className?: string
}

export const Panel = ({
  title,
  description,
  action,
  children,
  delay = 0,
  className = '',
}: PanelProps) => (
  <section
    className={`glass animate-rise rounded-2xl p-6 shadow-low transition-shadow duration-300 hover:shadow-high ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {(title || action) && (
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          {title && <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>}
          {description && <p className="mt-1 text-[13px] text-ink-soft">{description}</p>}
        </div>
        {action}
      </header>
    )}
    {children}
  </section>
)
