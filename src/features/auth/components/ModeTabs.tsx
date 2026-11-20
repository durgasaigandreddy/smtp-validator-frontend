export type SignInMode = 'user' | 'admin'

interface ModeTabsProps {
  mode: SignInMode
  onChange: (mode: SignInMode) => void
}

const options: { value: SignInMode; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

export const ModeTabs = ({ mode, onChange }: ModeTabsProps) => (
  <div
    role="group"
    aria-label="Sign in as"
    className="relative grid grid-cols-2 gap-1 rounded-xl bg-surface-sunken p-1"
  >
    <span
      aria-hidden
      className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-lg bg-surface-raised shadow-low transition-transform duration-300 ease-out"
      style={{ transform: mode === 'admin' ? 'translateX(calc(100% + 0.5rem))' : 'translateX(0)' }}
    />
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={mode === option.value}
        onClick={() => onChange(option.value)}
        className={`relative z-10 min-h-9 cursor-pointer rounded-lg text-[13px] font-semibold transition-colors duration-200 ${
          mode === option.value ? 'text-ink' : 'text-ink-soft hover:text-ink'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
)
