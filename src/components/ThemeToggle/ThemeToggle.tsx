import { useTheme } from '../../theme'

const sun = (
  <path
    d="M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
  />
)

const moon = (
  <path
    d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid size-9 cursor-pointer place-items-center rounded-full border border-hairline bg-surface-raised text-ink-soft transition-colors duration-200 hover:text-ink"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        {theme === 'dark' ? sun : moon}
      </svg>
    </button>
  )
}
