import { WorldMap } from '@/components/map/WorldMap'
import { PlacesBar } from '@/components/PlacesBar'
import { EmptyState } from '@/components/EmptyState'

export function MapColumn({
  mapRef, features, visited, justAdded, onToggle, onHover,
  chips, onRemove, onOpenVisited,
  onLoadSample, emptyDismissed, onDismissEmpty,
  collapsed, onShowPanel, count,
}) {
  return (
    <div className="wtm-mapcol">
      <WorldMap
        ref={mapRef}
        features={features}
        visited={visited}
        justAdded={justAdded}
        onToggle={onToggle}
        onHover={onHover}
      />

      <span className="mono wtm-map-label tl">Natural Earth Projection</span>
      <span className="mono wtm-map-label bl">Drag to pan · Scroll to zoom</span>

      <div className="wtm-zoom">
        <button onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out">−</button>
        <button className="wtm-zoom-reset" onClick={() => mapRef.current?.reset()} aria-label="Reset view">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {visited.size > 0 && (
        <PlacesBar
          chips={chips}
          justAdded={justAdded}
          onRemove={onRemove}
          onOpenAll={onOpenVisited}
        />
      )}

      {visited.size === 0 && !emptyDismissed && (
        <EmptyState onLoadSample={onLoadSample} onDismiss={onDismissEmpty} />
      )}

      {collapsed && (
        <button className="wtm-reopen" onClick={onShowPanel} aria-label="Show panel">
          ‹ <b>{count}</b> visited
        </button>
      )}
    </div>
  )
}
