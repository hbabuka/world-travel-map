import { useEffect } from 'react'
import { Chip } from '@/components/ui/Chip'
import { CONTINENT_ORDER } from '@/lib/continents'

export function AllPlacesModal({ open, byContinent, total, onRemove, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="wtm-modal-scrim" onClick={onClose}>
      <div className="wtm-modal" onClick={e => e.stopPropagation()}>
        <div className="wtm-modal-head">
          <div>
            <div className="mono">Field log · {total} {total === 1 ? 'country' : 'countries'}</div>
            <div className="wtm-modal-title">All places visited</div>
          </div>
          <button className="wtm-modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="wtm-modal-body">
          {total === 0 && <div className="wtm-modal-empty">No countries pinned yet.</div>}
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
                    <Chip key={name} name={name} onRemove={onRemove} />
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
