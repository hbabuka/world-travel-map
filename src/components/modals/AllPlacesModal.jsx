import { useEffect } from 'react'
import { Chip } from '@/components/ui/Chip'
import { CONTINENT_ORDER } from '@/lib/continents'

export function AllPlacesModal({
  open, tab, onTabChange,
  visitedByContinent, visitedTotal,
  remainingByContinent, remainingTotal,
  onRemove, onClose,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const isVisited = tab === 'visited'
  const byContinent = isVisited ? visitedByContinent : remainingByContinent
  const total = isVisited ? visitedTotal : remainingTotal

  return (
    <div className="wtm-modal-scrim" onClick={onClose}>
      <div className="wtm-modal" onClick={e => e.stopPropagation()}>
        <div className="wtm-modal-head">
          <div>
            <div className="mono">Field log</div>
            <div className="wtm-modal-title">Countries</div>
          </div>
          <button className="wtm-modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="wtm-modal-tabs">
          <button
            className={`wtm-modal-tab${isVisited ? ' active' : ''}`}
            onClick={() => onTabChange('visited')}
          >
            Visited <span className="wtm-modal-tab-count">{visitedTotal}</span>
          </button>
          <button
            className={`wtm-modal-tab${!isVisited ? ' active' : ''}`}
            onClick={() => onTabChange('remaining')}
          >
            Remaining <span className="wtm-modal-tab-count">{remainingTotal}</span>
          </button>
        </div>

        <div className="wtm-modal-body">
          {total === 0 && (
            <div className="wtm-modal-empty">
              {isVisited ? 'No countries pinned yet.' : 'You\'ve visited every country!'}
            </div>
          )}
          {CONTINENT_ORDER.map(cont => {
            const list = byContinent[cont] || []
            if (!list.length) return null
            return (
              <div className="wtm-modal-group" key={cont}>
                <div className="wtm-modal-group-head">
                  <span className="mono" style={{ color: 'var(--ink)', fontWeight: 700 }}>{cont}</span>
                  <span className="mono">{list.length}</span>
                </div>
                <div className="wtm-modal-chips">
                  {list.map(name => (
                    isVisited
                      ? <Chip key={name} name={name} onRemove={onRemove} />
                      : <span key={name} className="wtm-remaining-chip">{name}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
