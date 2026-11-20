const blobs = [
  { color: 'var(--aurora-one)', size: 620, top: '-14%', left: '-8%', delay: '0s', duration: '26s' },
  { color: 'var(--aurora-two)', size: 540, top: '18%', left: '62%', delay: '-9s', duration: '32s' },
  { color: 'var(--aurora-three)', size: 480, top: '64%', left: '12%', delay: '-16s', duration: '29s' },
]

export const AuroraBackdrop = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-page">
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent, var(--page-deep))' }}
    />
    {blobs.map((blob) => (
      <div
        key={blob.color + blob.left}
        className="absolute rounded-full blur-[90px]"
        style={{
          width: blob.size,
          height: blob.size,
          top: blob.top,
          left: blob.left,
          background: blob.color,
          animation: `aurora-drift ${blob.duration} ease-in-out ${blob.delay} infinite`,
        }}
      />
    ))}
  </div>
)
