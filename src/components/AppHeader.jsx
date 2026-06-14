import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-50m.json'
import { Logo } from '@/components/Logo'
import { Clock } from '@/components/ui/Clock'
import { continentOf, resolveAlias } from '@/lib/continents'

const ALL_FEATURES = feature(worldData, worldData.objects.countries).features
const NAME_SET = new Set(ALL_FEATURES.map(f => f.properties.name))

export function AppHeader({ user, visitedNames, onAddVisit, onSignOut, onConfirmReset }) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const searchBoxRef = useRef(null)
  const accountRef = useRef(null)

  useEffect(() => {
    const onDoc = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchOpen(false)
        setSearchFocused(false)
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out = [], seen = new Set()
    const alias = resolveAlias(q)
    if (alias && NAME_SET.has(alias)) { out.push(alias); seen.add(alias) }
    ALL_FEATURES.forEach(f => {
      const n = f.properties.name
      if (!seen.has(n) && n.toLowerCase().includes(q)) { out.push(n); seen.add(n) }
    })
    return out.slice(0, 7)
  }, [query])

  const pick = useCallback(name => {
    onAddVisit(name)
    setQuery('')
    setSearchOpen(false)
    setSearchFocused(false)
  }, [onAddVisit])

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Traveler'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className={`wtm-header${searchFocused ? ' search-active' : ''}`}>
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
          onFocus={() => { setSearchOpen(true); setSearchFocused(true) }}
          onKeyDown={e => {
            if (e.key === 'Enter' && matches.length) pick(matches[0])
            if (e.key === 'Escape') { setQuery(''); setSearchOpen(false); setSearchFocused(false) }
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
              <button
                className="wtm-menu-item wtm-menu-item--danger"
                onClick={() => { setMenuOpen(false); onConfirmReset() }}
              >
                Reset map
              </button>
              <button className="wtm-menu-item" onClick={() => { onSignOut(); setMenuOpen(false) }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
