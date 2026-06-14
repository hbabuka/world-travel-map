import { useState, useEffect, useRef } from 'react'

export function CountUp({ value, duration = 650 }) {
  const [disp, setDisp] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current, to = value
    prev.current = value
    if (from === to) { setDisp(to); return }
    let raf, start
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      const val = from + (to - from) * e
      setDisp(
        Number.isInteger(from) && Number.isInteger(to)
          ? Math.round(val)
          : Math.round(val * 10) / 10
      )
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{disp}</>
}
