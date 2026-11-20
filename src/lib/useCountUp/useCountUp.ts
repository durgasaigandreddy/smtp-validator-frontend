import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 900

const easeOut = (progress: number) => 1 - (1 - progress) ** 3

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useCountUp = (target: number) => {
  const [animated, setAnimated] = useState(target)
  const startValue = useRef(target)
  const isStatic = prefersReducedMotion()

  useEffect(() => {
    if (isStatic) return

    const from = startValue.current
    const startedAt = performance.now()
    let frame = 0

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / DURATION_MS)
      setAnimated(Math.round(from + (target - from) * easeOut(progress)))
      if (progress < 1) frame = requestAnimationFrame(step)
      else startValue.current = target
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, isStatic])

  return isStatic ? target : animated
}
