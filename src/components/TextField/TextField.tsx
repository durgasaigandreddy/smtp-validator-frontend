import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
  trailing?: ReactNode
}

export const TextField = ({
  label,
  hint,
  trailing,
  className = '',
  ...props
}: TextFieldProps) => {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold">
        {label} {hint && <span className="font-normal text-ink-soft">{hint}</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          className="min-h-11 w-full rounded-xl border border-hairline bg-surface-raised px-3.5 text-ink transition-colors duration-200 placeholder:text-ink-faint hover:border-hairline-strong focus:border-accent-bright focus:outline-none"
          {...props}
        />
        {trailing && (
          <span className="absolute inset-y-0 right-2 inline-flex items-center">{trailing}</span>
        )}
      </div>
    </div>
  )
}
