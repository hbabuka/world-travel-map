import {
  useState, useEffect, useRef, useMemo, useCallback,
  useLayoutEffect, forwardRef,
} from 'react'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { WorldMap } from '@/components/map/WorldMap'
import { LoginScreen } from '@/components/auth/LoginScreen'
import {
  CONTINENT_ORDER, WORLD_TOTAL,
  continentOf, resolveAlias, SEED,
} from '@/lib/continents'

/* ─── Count-up animated number ───────────────────────────────────────────── */
function CountUp({ value, duration = 650 }) {
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

/* ─── Live clock ─────────────────────────────────────────────────────────── */
function Clock() {
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

/* ─── Removable country chip ─────────────────────────────────────────────── */
function Chip({ name, isNew, onRemove }) {
  return (
    <span className={`wtm-chip${isNew ? ' is-new' : ''}`}>
      {name}
      <button className="wtm-chip-x" onClick={() => onRemove(name)} aria-label={`Remove ${name}`}>
        ×
      </button>
    </span>
  )
}

/* ─── Places bottom bar ──────────────────────────────────────────────────── */
function PlacesBar({ chips, justAdded, onRemove, onOpenAll }) {
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
      const reserve = i < kids.length - 1 ? 128 : 0
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

/* ─── All Places modal ───────────────────────────────────────────────────── */
function AllPlacesModal({ open, byContinent, total, onRemove, onClose }) {
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

/* ─── Country tooltip (cursor-following via direct DOM writes) ───────────── */
const Tooltip = forwardRef(function Tooltip({ name, initial, visited, continent }, ref) {
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

/* ─── Empty state card ───────────────────────────────────────────────────── */
function EmptyState({ onLoadSample }) {
  return (
    <div className="wtm-empty">
      <div className="wtm-empty-card">
        <div className="mono wtm-empty-eyebrow">Get started</div>
        <h2 className="wtm-empty-title">Start your travel map</h2>
        <p className="wtm-empty-sub">
          Search a country up top, or click any shape on the map to pin where you&rsquo;ve been.
        </p>
        <div className="wtm-empty-actions">
          <button className="wtm-empty-btn" onClick={onLoadSample}>Load a sample trip</button>
          <span className="mono wtm-empty-hint">or click the map</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Parse world-atlas once at module level ─────────────────────────────── */
const ALL_FEATURES = feature(worldData, worldData.objects.countries).features

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signInWithGitHub, signInWithEmail, signOut } = useAuth()
  const { addTrip, removeByName, visitedNames } = useTrips(user?.id)

  const [hoverName, setHoverName] = useState(null)
  const [justAdded, setJustAdded] = useState(null)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const mapRef = useRef(null)
  const addTimer = useRef(null)
  const searchBoxRef = useRef(null)
  const tipRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const accountRef = useRef(null)

  /* Tooltip follows cursor via direct DOM writes — avoids map re-renders on mousemove */
  useEffect(() => {
    const onMove = e => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (tipRef.current) {
        tipRef.current.style.left = e.clientX + 'px'
        tipRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const onDoc = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) setSearchOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const pulse = useCallback(name => {
    setJustAdded(name)
    clearTimeout(addTimer.current)
    addTimer.current = setTimeout(() => setJustAdded(null), 1200)
  }, [])

  const addVisit = useCallback(name => {
    if (visitedNames.has(name)) return
    addTrip({ country_name: name, country_code: 'XX', title: name })
    pulse(name)
  }, [visitedNames, addTrip, pulse])

  const removeVisit = useCallback(name => {
    removeByName(name)
  }, [removeByName])

  const toggle = useCallback(name => {
    if (visitedNames.has(name)) removeVisit(name)
    else addVisit(name)
  }, [visitedNames, addVisit, removeVisit])

  const loadSample = useCallback(() => {
    SEED.forEach(name => {
      if (!visitedNames.has(name)) addTrip({ country_name: name, country_code: 'XX', title: name })
    })
  }, [visitedNames, addTrip])

  const resetMap = useCallback(() => {
    ;[...visitedNames].forEach(name => removeByName(name))
    setMenuOpen(false)
    setModalOpen(false)
  }, [visitedNames, removeByName])

  const nameSet = useMemo(() => new Set(ALL_FEATURES.map(f => f.properties.name)), [])

  const continentTotals = useMemo(() => {
    const totals = {}
    CONTINENT_ORDER.forEach(c => { totals[c] = 0 })
    ALL_FEATURES.forEach(f => {
      const c = continentOf(f.properties.name)
      if (c && totals[c] != null) totals[c] += 1
    })
    return totals
  }, [])

  const visitedByContinent = useMemo(() => {
    const counts = {}
    CONTINENT_ORDER.forEach(c => { counts[c] = 0 })
    visitedNames.forEach(name => {
      const c = continentOf(name)
      if (c && counts[c] != null) counts[c] += 1
    })
    return counts
  }, [visitedNames])

  const groupedVisited = useMemo(() => {
    const g = {}
    CONTINENT_ORDER.forEach(c => { g[c] = [] })
    visitedNames.forEach(name => {
      const c = continentOf(name)
      if (c && g[c]) g[c].push(name)
    })
    Object.values(g).forEach(arr => arr.sort((a, b) => a.localeCompare(b)))
    return g
  }, [visitedNames])

  const count = visitedNames.size
  const pct = Math.round((count / WORLD_TOTAL) * 1000) / 10
  const continentsCovered = CONTINENT_ORDER.filter(c => visitedByContinent[c] > 0).length

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out = [], seen = new Set()
    const alias = resolveAlias(q)
    if (alias && nameSet.has(alias)) { out.push(alias); seen.add(alias) }
    ALL_FEATURES.forEach(f => {
      const n = f.properties.name
      if (!seen.has(n) && n.toLowerCase().includes(q)) { out.push(n); seen.add(n) }
    })
    return out.slice(0, 7)
  }, [query, nameSet])

  const pick = useCallback(name => {
    addVisit(name)
    setQuery('')
    setSearchOpen(false)
  }, [addVisit])

  /* chips: most-recent first, justAdded pinned to front */
  const chips = useMemo(() => {
    const arr = [...visitedNames].reverse()
    if (justAdded && arr.includes(justAdded)) {
      return [justAdded, ...arr.filter(n => n !== justAdded)]
    }
    return arr
  }, [visitedNames, justAdded])

  /* ─── Auth loading ─────────────────────────────────────────── */
  if (authLoading) {
    return (
      <div className="wtm-root" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="wtm-spinner" />
      </div>
    )
  }

  /* ─── Auth screen ──────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="wtm-root">
        <LoginScreen
          features={ALL_FEATURES}
          onSignInGoogle={signInWithGoogle}
          onSignInGitHub={signInWithGitHub}
          onSignInEmail={signInWithEmail}
        />
      </div>
    )
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Traveler'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  /* ─── Main app ─────────────────────────────────────────────── */
  return (
    <div className="wtm-root chip-outline">

      {/* Header */}
      <header className="wtm-header">
        <div className="wtm-brand">
          <span className="wtm-mark" aria-hidden="true" />
          <span className="wtm-wordmark">World Travel Map</span>
          <span className="mono wtm-brand-tag">Field Log</span>
        </div>

        <div className="wtm-search" ref={searchBoxRef}>
          <svg className="wtm-search-icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="wtm-search-input"
            type="text"
            placeholder="Search a country to pin it…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && matches.length) pick(matches[0])
              if (e.key === 'Escape') { setQuery(''); setSearchOpen(false) }
            }}
          />
          {searchOpen && matches.length > 0 && (
            <ul className="wtm-results">
              {matches.map(name => {
                const isV = visitedNames.has(name)
                const cont = continentOf(name)
                return (
                  <li key={name}>
                    <button className="wtm-result" onClick={() => pick(name)}>
                      <span className="wtm-result-name">{name}</span>
                      <span className="wtm-result-meta">
                        {cont && <span className="mono" style={{ color: 'var(--faint)' }}>{cont}</span>}
                        {isV
                          ? <span className="wtm-result-check">✓ Pinned</span>
                          : <span className="wtm-result-add">+ Add</span>
                        }
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="wtm-headend">
          <Clock />
          <div className="wtm-account" ref={accountRef}>
            <button
              className="wtm-avatar"
              title="Your account"
              aria-label="Your account"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span>{initials}</span>
            </button>
            {menuOpen && (
              <div className="wtm-menu">
                <div className="wtm-menu-id">
                  <div className="wtm-menu-name">{displayName}</div>
                  <div className="mono wtm-menu-mail">{user.email}</div>
                </div>
                <button className="wtm-menu-item" onClick={resetMap}>Reset map</button>
                <button className="wtm-menu-item" onClick={() => { signOut(); setMenuOpen(false) }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stage */}
      <div className={`wtm-stage${collapsed ? ' collapsed' : ''}`}>
        <div className="wtm-mapcol">
          <WorldMap
            ref={mapRef}
            features={ALL_FEATURES}
            visited={visitedNames}
            justAdded={justAdded}
            onToggle={toggle}
            onHover={setHoverName}
          />

          <span className="mono wtm-map-label tl">Natural Earth Projection</span>
          <span className="mono wtm-map-label bl">Drag to pan · Scroll to zoom</span>

          <div className="wtm-zoom">
            <button onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in">+</button>
            <button onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out">−</button>
            <button className="wtm-zoom-reset" onClick={() => mapRef.current?.reset()} aria-label="Reset view">RST</button>
          </div>

          {count > 0 && (
            <PlacesBar
              chips={chips}
              justAdded={justAdded}
              onRemove={removeVisit}
              onOpenAll={() => setModalOpen(true)}
            />
          )}

          {count === 0 && <EmptyState onLoadSample={loadSample} />}

          {collapsed && (
            <button className="wtm-reopen" onClick={() => setCollapsed(false)} aria-label="Show panel">
              ‹ <b>{count}</b> visited
            </button>
          )}
        </div>

        {/* Side panel */}
        <aside className="wtm-panel">
          <div className="wtm-panel-inner">
            <div className="wtm-panel-head">
              <span className="mono">Overview</span>
              <button className="wtm-collapse" onClick={() => setCollapsed(true)} aria-label="Collapse panel">›</button>
            </div>

            {/* Hero stat */}
            <div className="wtm-sect">
              <div className="wtm-hero-num"><CountUp value={count} /></div>
              <div className="mono wtm-hero-label">Countries visited</div>
              <div className="wtm-substats">
                <div className="wtm-substat">
                  <div className="wtm-substat-num">
                    <CountUp value={pct} /><span className="of">%</span>
                  </div>
                  <div className="mono wtm-substat-label">Of the world</div>
                </div>
                <div className="wtm-substat">
                  <div className="wtm-substat-num">
                    <CountUp value={continentsCovered} /><span className="of">/6</span>
                  </div>
                  <div className="mono wtm-substat-label">Continents</div>
                </div>
              </div>
            </div>

            {/* Continent breakdown */}
            <div className="wtm-sect">
              <div className="wtm-sect-head"><span className="mono">By continent</span></div>
              {CONTINENT_ORDER.map(c => {
                const tot = continentTotals[c] || 0
                const v = visitedByContinent[c] || 0
                const w = tot ? Math.round((v / tot) * 100) : 0
                return (
                  <div className="wtm-cont-row" key={c}>
                    <div className="wtm-cont-top">
                      <span className="wtm-cont-name">{c}</span>
                      <span className="wtm-cont-count"><b>{v}</b> / {tot}</span>
                    </div>
                    <div className="wtm-cont-track">
                      <div className="wtm-cont-bar" style={{ width: w + '%' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Cursor tooltip — shown while hovering a country */}
      {hoverName && (
        <Tooltip
          ref={tipRef}
          initial={mouse.current}
          name={hoverName}
          visited={visitedNames.has(hoverName)}
          continent={continentOf(hoverName)}
        />
      )}

      {/* All places modal */}
      <AllPlacesModal
        open={modalOpen}
        byContinent={groupedVisited}
        total={count}
        onRemove={removeVisit}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
