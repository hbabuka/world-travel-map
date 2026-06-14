import { CountUp } from '@/components/ui/CountUp'
import { CONTINENT_ORDER } from '@/lib/continents'
import { getRank, RANKS } from '@/lib/ranks'

const RANK_ICONS = [
  // Blank Page — empty document
  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  // First Ink — pen
  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  // Dog-Eared — bookmark
  <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>,
  // Full Passport — open book
  <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
  // Second Passport — layers
  <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
  // Diplomat — briefcase
  <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  // Cartographer — compass
  <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
  // World Atlas — globe
  <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
]

export function SidePanel({ count, pct, continentsCovered, continentTotals, visitedByContinent, mapTotal, onCollapse, onOpenRemaining }) {
  const { rank, next, index, progress } = getRank(count)

  return (
    <aside className="wtm-panel">
      <div className="wtm-panel-inner">
        <div className="wtm-panel-head">
          <span className="mono">Overview</span>
          <button className="wtm-collapse" onClick={onCollapse} aria-label="Collapse panel">›</button>
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
          <div className="wtm-sect-head">
            <span className="mono">By continent</span>
            {mapTotal - count > 0 && (
              <button className="wtm-remaining-btn" onClick={onOpenRemaining}>
                {mapTotal - count} remaining
              </button>
            )}
          </div>
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

        {/* Passport rank */}
        <div className="wtm-sect">
          <div className="wtm-sect-head"><span className="mono">Passport rank</span></div>
          <div className="wtm-rank">
            <div className="wtm-rank-top">
              <div className="wtm-rank-badge">
                <div className="wtm-rank-stamp">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {RANK_ICONS[index]}
                  </svg>
                </div>
                <span className="wtm-rank-name">{rank.name}</span>
              </div>
            </div>

            <div className="wtm-rank-steps" aria-label="Rank progress">
              {RANKS.map((r, i) => (
                <div key={r.name} className="wtm-rank-step">
                  <div
                    className={`wtm-rank-dot${i < index ? ' done' : i === index ? ' current' : ''}`}
                    title={r.name}
                  />
                  {i < RANKS.length - 1 && (
                    <div className={`wtm-rank-seg${i < index ? ' done' : ''}`}>
                      {i === index && (
                        <div className="wtm-rank-seg-fill" style={{ width: `${progress * 100}%` }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="wtm-rank-foot mono">
              {next ? (
                <span className="wtm-rank-next">{next.min - count} to <b>{next.name}</b></span>
              ) : (
                <span className="wtm-rank-max">Max rank reached</span>
              )}
              <span className="wtm-faint">{count} stamped</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
