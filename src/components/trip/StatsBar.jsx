// TODO: display visited / total countries and percentage
const TOTAL_COUNTRIES = 195

export function StatsBar({ visitedCount }) {
  const pct = ((visitedCount / TOTAL_COUNTRIES) * 100).toFixed(1)
  return (
    <div className="flex items-center gap-4 px-4 py-2 text-sm">
      <span className="text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{visitedCount}</span> / {TOTAL_COUNTRIES} countries
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div className="h-full bg-[var(--color-primary-500)] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[var(--color-text-muted)]">{pct}%</span>
    </div>
  )
}
