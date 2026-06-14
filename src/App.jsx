import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-50m.json'
import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { AppHeader } from '@/components/AppHeader'
import { MapColumn } from '@/components/MapColumn'
import { MapTooltip } from '@/components/map/MapTooltip'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { LoadingScreen } from '@/components/auth/LoadingScreen'
import { SidePanel } from '@/components/SidePanel'
import { AllPlacesModal } from '@/components/modals/AllPlacesModal'
import { ConfirmResetModal } from '@/components/modals/ConfirmResetModal'
import { CONTINENT_ORDER, continentOf, SEED } from '@/lib/continents'

const ALL_FEATURES = feature(worldData, worldData.objects.countries).features

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signInWithGitHub, signInWithEmail, signOut } = useAuth()
  const { addTrip, removeByName, visitedNames } = useTrips(user?.id)

  const [hoverName, setHoverName] = useState(null)
  const [justAdded, setJustAdded] = useState(null)
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState('visited')
  const [confirmReset, setConfirmReset] = useState(false)
  const [emptyDismissed, setEmptyDismissed] = useState(false)

  const mapRef = useRef(null)
  const addTimer = useRef(null)
  const tipRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const [tipInitial, setTipInitial] = useState({ x: 0, y: 0 })

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
    if (hoverName) setTipInitial({ ...mouse.current })
  }, [hoverName])

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
    setModalOpen(false)
    setConfirmReset(false)
    setEmptyDismissed(false)
  }, [visitedNames, removeByName])

  /* ─── Derived stats ─────────────────────────────────────────── */
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

  const groupedRemaining = useMemo(() => {
    const g = {}
    CONTINENT_ORDER.forEach(c => { g[c] = [] })
    ALL_FEATURES.forEach(f => {
      const name = f.properties.name
      const c = continentOf(name)
      if (c && g[c] && !visitedNames.has(name)) g[c].push(name)
    })
    Object.values(g).forEach(arr => arr.sort((a, b) => a.localeCompare(b)))
    return g
  }, [visitedNames])

  const count = useMemo(() =>
    Object.values(visitedByContinent).reduce((a, b) => a + b, 0)
  , [visitedByContinent])
  const mapTotal = Object.values(continentTotals).reduce((a, b) => a + b, 0)
  const pct = Math.round((count / mapTotal) * 1000) / 10
  const continentsCovered = CONTINENT_ORDER.filter(c => visitedByContinent[c] > 0).length

  const chips = useMemo(() => {
    const arr = [...visitedNames].reverse()
    if (justAdded && arr.includes(justAdded)) {
      return [justAdded, ...arr.filter(n => n !== justAdded)]
    }
    return arr
  }, [visitedNames, justAdded])

  /* ─── Auth states ───────────────────────────────────────────── */
  if (authLoading) {
    return <div className="wtm-root"><LoadingScreen features={ALL_FEATURES} /></div>
  }

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

  /* ─── Main app ──────────────────────────────────────────────── */
  return (
    <div className="wtm-root chip-outline">
      <AppHeader
        user={user}
        visitedNames={visitedNames}
        onAddVisit={addVisit}
        onSignOut={signOut}
        onConfirmReset={() => setConfirmReset(true)}
      />

      <div className={`wtm-stage${collapsed ? ' collapsed' : ''}`}>
        <MapColumn
          mapRef={mapRef}
          features={ALL_FEATURES}
          visited={visitedNames}
          justAdded={justAdded}
          onToggle={toggle}
          onHover={setHoverName}
          chips={chips}
          onRemove={removeVisit}
          onOpenVisited={() => { setModalTab('visited'); setModalOpen(true) }}
          onLoadSample={loadSample}
          emptyDismissed={emptyDismissed}
          onDismissEmpty={() => setEmptyDismissed(true)}
          collapsed={collapsed}
          onShowPanel={() => setCollapsed(false)}
          count={count}
        />

        <SidePanel
          count={count}
          pct={pct}
          continentsCovered={continentsCovered}
          continentTotals={continentTotals}
          visitedByContinent={visitedByContinent}
          mapTotal={mapTotal}
          onCollapse={() => setCollapsed(true)}
          onOpenRemaining={() => { setModalTab('remaining'); setModalOpen(true) }}
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
        tab={modalTab}
        onTabChange={setModalTab}
        visitedByContinent={groupedVisited}
        visitedTotal={count}
        remainingByContinent={groupedRemaining}
        remainingTotal={mapTotal - count}
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
