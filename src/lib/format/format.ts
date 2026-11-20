const numberFormat = new Intl.NumberFormat('en-GB')

const compactFormat = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 })

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

const minutesSince = (iso: string) => Math.round((Date.now() - new Date(iso).getTime()) / 60_000)

export const formatCount = (value: number) => numberFormat.format(value)

export const formatCompact = (value: number) =>
  value >= 10_000 ? compactFormat.format(value) : numberFormat.format(value)

export const formatPercent = (fraction: number) => `${Math.round(fraction * 100)}%`

export const formatTime = (iso: string) => timeFormat.format(new Date(iso))

export const formatRelativeDay = (iso: string) => {
  const date = new Date(iso)
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
  const daysApart = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)

  if (daysApart === 0) return `Today, ${timeFormat.format(date)}`
  if (daysApart === 1) return 'Yesterday'
  return dateFormat.format(date)
}

export const formatMinutesSince = (iso: string) => {
  const minutes = minutesSince(iso)
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 min ago'
  return `${minutes} min ago`
}

export const formatMinutesElapsed = (iso: string) => {
  const minutes = minutesSince(iso)
  if (minutes < 1) return 'less than a minute'
  if (minutes === 1) return '1 minute'
  return `${minutes} minutes`
}
