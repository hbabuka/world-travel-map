import { WorldMap } from '@/components/map/WorldMap'
import { SEED, WORLD_TOTAL } from '@/lib/continents'

const decorSet = new Set(SEED)

export function LoadingScreen({ features }) {
  return (
    <div className="wtm-auth">
      <div className="wtm-auth-left">
        <div className="wtm-brand">
          <span className="wtm-mark" aria-hidden="true" />
          <span className="wtm-wordmark">World Travel Map</span>
          <span className="mono wtm-brand-tag">Field Log</span>
        </div>

        <div className="wtm-auth-mid">
          <div className="mono wtm-auth-eyebrow">Personal travel log · 2026</div>
          <h1 className="wtm-auth-title">Every country,<br />one map.</h1>
          <div className="wtm-loading-bar-wrap">
            <div className="wtm-loading-bar" />
          </div>
          <p className="mono wtm-loading-label">Loading your field log…</p>
        </div>

        <div className="mono wtm-auth-foot">
          <span>Secure sign-in</span>
          <span>Supabase Auth</span>
        </div>
      </div>

      <div className="wtm-auth-right">
        <div className="wtm-auth-art">
          {features?.length ? (
            <WorldMap
              features={features}
              visited={decorSet}
              justAdded={null}
              decorative
            />
          ) : null}
        </div>
        <div className="wtm-auth-vignette" />
        <span className="mono wtm-auth-rlabel tl">N 00.00° · E 00.00°</span>
        <span className="mono wtm-auth-rlabel br">Natural Earth · {WORLD_TOTAL} countries</span>
      </div>
    </div>
  )
}
