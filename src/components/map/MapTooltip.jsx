import { forwardRef } from 'react'

export const MapTooltip = forwardRef(function MapTooltip({ name, initial, visited, continent }, ref) {
  return (
    <div className="wtm-tooltip" ref={ref} style={{ left: initial.x, top: initial.y }}>
      <div className="wtm-tip-name">{name}</div>
      <div className={`wtm-tip-status${visited ? ' is-visited' : ''}`}>
        {visited ? '✓ Visited' : 'Click to add'}
        {continent && <span className="wtm-tip-cont"> · {continent}</span>}
      </div>
    </div>
  )
})
