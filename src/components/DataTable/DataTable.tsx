import type { ReactNode } from 'react'

export const DataTable = ({ headers, children }: { headers: ReactNode[]; children: ReactNode }) => (
  <div className="-mx-2 overflow-x-auto px-2">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="border-b border-hairline px-3 pb-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
)

export const Row = ({ children }: { children: ReactNode }) => (
  <tr className="transition-colors duration-150 hover:bg-surface-sunken">{children}</tr>
)

export const Cell = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <td className={`border-b border-hairline px-3 py-3 align-middle ${className}`}>{children}</td>
)
