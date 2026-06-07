// TODO: collapsible left sidebar with trip list and stats
import { StatsBar } from '@/components/trip/StatsBar'
import { TripList } from '@/components/trip/TripList'

export function Sidebar({ trips, visitedCountryCodes, onTripSelect }) {
  return (
    <aside className="flex flex-col w-72 shrink-0 h-full border-r border-[var(--color-border)] bg-[var(--color-surface)] overflow-y-auto">
      <div className="p-4 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold">My Trips</h2>
      </div>
      <StatsBar visitedCount={visitedCountryCodes.length} />
      <div className="flex-1 py-2 overflow-y-auto">
        <TripList trips={trips} onSelect={onTripSelect} />
      </div>
    </aside>
  )
}
