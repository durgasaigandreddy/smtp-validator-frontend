interface RevealKeyButtonProps {
  isVisible: boolean
  onToggle: () => void
}

export const RevealKeyButton = ({ isVisible, onToggle }: RevealKeyButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isVisible ? 'Hide key' : 'Show key'}
    className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-faint transition-colors duration-200 hover:text-ink"
  >
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
      {!isVisible && (
        <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      )}
    </svg>
  </button>
)
