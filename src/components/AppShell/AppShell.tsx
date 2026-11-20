import type { ReactNode } from 'react'
import { Badge } from '../Badge'
import { BrandMark } from '../BrandMark'
import { Button } from '../Button'
import { ThemeToggle } from '../ThemeToggle'

interface AppShellProps {
  subtitle: string
  identityName: string
  isAdmin: boolean
  onSignOut: () => void
  children: ReactNode
}

export const AppShell = ({
  subtitle,
  identityName,
  isAdmin,
  onSignOut,
  children,
}: AppShellProps) => (
  <div className="min-h-screen">
    <header className="glass sticky top-0 z-20 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-[15px] leading-tight font-semibold tracking-tight">EmailCheck</p>
            <p className="text-[12px] leading-tight text-ink-soft">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={isAdmin ? 'accent' : 'neutral'}>{identityName}</Badge>
          <ThemeToggle />
          <Button variant="quiet" size="small" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>

    <main className="mx-auto grid max-w-[1200px] gap-5 px-6 pt-6 pb-16">{children}</main>
  </div>
)
