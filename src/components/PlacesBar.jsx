import { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { Chip } from '@/components/ui/Chip'

export function PlacesBar({ chips, justAdded, onRemove, onOpenAll }) {
  const rowRef = useRef(null)
  const measureRef = useRef(null)
  const [visN, setVisN] = useState(chips.length)

  const recompute = useCallback(() => {
    const row = rowRef.current, meas = measureRef.current
    if (!row || !meas) return
    const avail = row.clientWidth
    const kids = meas.children
    const gap = 7
    let used = 0, fit = 0
    for (let i = 0; i < kids.length; i++) {
      const w = kids[i].getBoundingClientRect().width
      const next = used + (i > 0 ? gap : 0) + w
      const reserve = 0
      if (next + reserve > avail) break
      used = next; fit++
    }
    setVisN(Math.max(1, fit))
  }, [])

  useLayoutEffect(() => { recompute() }, [chips, recompute])
  useEffect(() => {
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', recompute)
      return () => window.removeEventListener('resize', recompute)
    }
    const ro = new ResizeObserver(recompute)
    ro.observe(row)
    return () => ro.disconnect()
  }, [recompute])

  const hidden = chips.length - visN
  const shown = chips.slice(0, visN)

  return (
    <div className="wtm-places">
      {chips.length === 0 ? (
        <div className="wtm-places-row">
          <span className="wtm-places-empty">Search above or click the map to pin where you&rsquo;ve been.</span>
        </div>
      ) : (
        <>
          <div className="wtm-places-row" ref={rowRef}>
            {shown.map(name => (
              <Chip key={name} name={name} isNew={justAdded === name} onRemove={onRemove} />
            ))}
          </div>
          <button className="wtm-more" onClick={onOpenAll}>
            {hidden > 0 ? `+${hidden} more` : 'View all'}
          </button>
        </>
      )}
      {/* hidden measurer — mirrors chip widths without layout side effects */}
      <div className="wtm-measure" ref={measureRef} aria-hidden="true">
        {chips.map(name => (
          <span className="wtm-chip" key={name}>
            {name}<button className="wtm-chip-x">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}
