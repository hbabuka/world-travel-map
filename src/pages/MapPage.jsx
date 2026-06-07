import { Sidebar } from '@/components/layout/Sidebar'
import { WorldMap } from '@/components/map/WorldMap'
import { MapControls } from '@/components/map/MapControls'
import { TripModal } from '@/components/trip/TripModal'
import { useMapStore } from '@/store/mapStore'

export function MapPage({ trips, visitedCountryCodes, onAddTrip, onUpdateTrip, onDeleteTrip }) {
  const { setSelectedCountry, setTripModalOpen } = useMapStore()

  function handleCountryClick(country) {
    setSelectedCountry(country)
    setTripModalOpen(true)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar trips={trips} visitedCountryCodes={visitedCountryCodes} />
      <main className="flex-1 relative overflow-hidden p-4">
        <WorldMap visitedCountryCodes={visitedCountryCodes} onCountryClick={handleCountryClick} />
        <MapControls />
      </main>
      <TripModal onSave={onAddTrip} />
    </div>
  )
}
