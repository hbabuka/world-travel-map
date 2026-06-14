import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { WorldMap } from '@/components/map/WorldMap'
import { MapTooltip } from '@/components/map/MapTooltip'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { LoadingScreen } from '@/components/auth/LoadingScreen'
import { Logo } from '@/components/Logo'
import { Clock } from '@/components/ui/Clock'
import { PlacesBar } from '@/components/PlacesBar'
import { EmptyState } from '@/components/EmptyState'
import { SidePanel } from '@/components/SidePanel'
import { AllPlacesModal } from '@/components/modals/AllPlacesModal'
import { ConfirmResetModal } from '@/components/modals/ConfirmResetModal'
import {
  CONTINENT_ORDER, WORLD_TOTAL,
  continentOf, resolveAlias, SEED,
} from '@/lib/continents'

const ALL_FEATURES = feature(worldData, worldData.objects.countries).features

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
  const [confirmReset, setConfirmReset] = useState(false)
  const [emptyDismissed, setEmptyDismissed] = useState(false)

  const mapRef = useRef(null)
  const addTimer = useRef(null)
  const searchBoxRef = useRef(null)
  const tipRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const [tipInitial, setTipInitial] = useState({ x: 0, y: 0 })
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

  /* Capture mount position when tooltip first appears */
  useEffect(() => {
    if (hoverName) setTipInitial({ ...mouse.current })
  }, [hoverName])

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

  const removeVisit = useCallback(name => removeByName(name), [removeByName])

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
    setConfirmReset(false)
    setEmptyDismissed(false)
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
      <div className="wtm-root">
        <LoadingScreen features={ALL_FEATURES} />
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
          <Logo />
          <span className="wtm-wordmark">Stamped</span>
          <span className="mono wtm-brand-tag">World Travel Map</span>
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
                <button className="wtm-menu-item wtm-menu-item--danger" onClick={() => { setMenuOpen(false); setConfirmReset(true) }}>Reset map</button>
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
            <button className="wtm-zoom-reset" onClick={() => mapRef.current?.reset()} aria-label="Reset view">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          </div>

          {count > 0 && (
            <PlacesBar
              chips={chips}
              justAdded={justAdded}
              onRemove={removeVisit}
              onOpenAll={() => setModalOpen(true)}
            />
          )}

          {count === 0 && !emptyDismissed && (
            <EmptyState onLoadSample={loadSample} onDismiss={() => setEmptyDismissed(true)} />
          )}

          {collapsed && (
            <button className="wtm-reopen" onClick={() => setCollapsed(false)} aria-label="Show panel">
              ‹ <b>{count}</b> visited
            </button>
          )}
        </div>

        <SidePanel
          count={count}
          pct={pct}
          continentsCovered={continentsCovered}
          continentTotals={continentTotals}
          visitedByContinent={visitedByContinent}
          onCollapse={() => setCollapsed(true)}
        />
      </div>

      {hoverName && (
        <MapTooltip
          ref={tipRef}
          initial={tipInitial}
          name={hoverName}
          visited={visitedNames.has(hoverName)}
          continent={continentOf(hoverName)}
        />
      )}

      <AllPlacesModal
        open={modalOpen}
        byContinent={groupedVisited}
        total={count}
        onRemove={removeVisit}
        onClose={() => setModalOpen(false)}
      />

      {confirmReset && (
        <ConfirmResetModal
          count={count}
          onConfirm={resetMap}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  )
}
