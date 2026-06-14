import { useState, useEffect } from 'react'

export function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const p = n => String(n).padStart(2, '0')
  return (
    <span className="mono wtm-clock">
      {now.getFullYear()}.{p(now.getMonth() + 1)}.{p(now.getDate())} · {p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}
    </span>
  )
}
