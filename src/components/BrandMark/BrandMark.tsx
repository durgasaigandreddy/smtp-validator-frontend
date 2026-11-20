export const BrandMark = ({ size = 34 }: { size?: number }) => (
  <span
    className="grid shrink-0 place-items-center rounded-[11px] shadow-low"
    style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, var(--accent-bright), var(--accent))',
    }}
  >
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z"
        stroke="var(--on-accent)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m4 8 7.1 4.6a1.6 1.6 0 0 0 1.8 0L20 8"
        stroke="var(--on-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </span>
)
