// TODO: modal for adding/editing a trip entry for a selected country
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMapStore } from '@/store/mapStore'

export function TripModal({ onSave }) {
  const { tripModalOpen, setTripModalOpen, selectedCountry, editingTrip } = useMapStore()

  return (
    <Dialog open={tripModalOpen} onOpenChange={setTripModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTrip ? 'Edit trip' : `Add trip — ${selectedCountry?.name ?? ''}`}</DialogTitle>
        </DialogHeader>
        {/* TripForm will go here */}
        <p className="text-sm text-[var(--color-text-muted)]">Form coming soon…</p>
      </DialogContent>
    </Dialog>
  )
}
