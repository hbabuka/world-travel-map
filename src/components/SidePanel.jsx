import { CountUp } from '@/components/ui/CountUp'
import { CONTINENT_ORDER } from '@/lib/continents'
import { getRank, RANKS } from '@/lib/ranks'

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
                    <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
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
