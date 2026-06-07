// TODO: sidebar list of all trips, grouped by country
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TripList({ trips, onSelect }) {
  if (!trips.length) {
    return <p className="text-sm text-[var(--color-text-muted)] px-4">No trips yet. Click a country to add one!</p>
  }
  return (
    <ul className="flex flex-col gap-2 px-2">
      {trips.map((trip) => (
        <li key={trip.id}>
          <Card className="cursor-pointer hover:shadow-[var(--shadow-panel)] transition-shadow" onClick={() => onSelect?.(trip)}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{trip.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{trip.country_name}</p>
                </div>
                {trip.start_date && <Badge variant="outline">{trip.start_date.slice(0, 4)}</Badge>}
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
