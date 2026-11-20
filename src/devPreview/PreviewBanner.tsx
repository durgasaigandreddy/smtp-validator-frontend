import { DEV_PREVIEW } from './flag'

export const PreviewBanner = () => {
  if (!DEV_PREVIEW) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-4 py-1.5 text-center text-[12px] font-semibold"
      style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}
    >
      Preview mode · sample data, no backend · any key signs you in as admin, a key containing
      “user” signs you in as a client
    </div>
  )
}
