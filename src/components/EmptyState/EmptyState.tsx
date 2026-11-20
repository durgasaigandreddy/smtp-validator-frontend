export const EmptyState = ({ title, hint }: { title: string; hint: string }) => (
  <div className="grid place-items-center gap-1.5 rounded-xl bg-surface-sunken px-5 py-9 text-center">
    <p className="font-semibold">{title}</p>
    <p className="text-[13px] text-ink-soft">{hint}</p>
  </div>
)
