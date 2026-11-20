import type { ReactNode } from 'react'

interface QueryBoundaryProps {
  isLoading: boolean
  error: unknown
  children: ReactNode
}

const Skeleton = () => (
  <div className="grid gap-2.5" aria-busy>
    {[0, 1, 2].map((row) => (
      <span
        key={row}
        className="h-4 animate-pulse rounded-md bg-track"
        style={{ width: `${100 - row * 18}%` }}
      />
    ))}
  </div>
)

export const QueryBoundary = ({ isLoading, error, children }: QueryBoundaryProps) => {
  if (isLoading) return <Skeleton />
  if (error)
    return (
      <p role="alert" className="text-[13px] font-medium text-danger">
        {(error as Error).message}
      </p>
    )
  return <>{children}</>
}
