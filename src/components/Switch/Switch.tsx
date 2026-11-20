import { useId } from 'react'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Switch = ({ label, checked, onChange }: SwitchProps) => {
  const id = useId()

  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5 text-[13px]">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-10 shrink-0 rounded-full border border-hairline transition-colors duration-200"
        style={{ background: checked ? 'var(--accent)' : 'var(--track)' }}
      >
        <span
          className="absolute top-0.5 size-4.5 rounded-full bg-white shadow-low transition-[left] duration-200"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </button>
      {label}
    </label>
  )
}
