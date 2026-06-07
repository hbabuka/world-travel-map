import { useState, createContext, useContext } from 'react'

const MapStoreContext = createContext(null)

export function MapStoreProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [projection, setProjection] = useState('naturalEarth1')
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [tripModalOpen, setTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)

  return (
    <MapStoreContext.Provider value={{
      selectedCountry, setSelectedCountry,
      projection, setProjection,
      zoom, setZoom,
      panOffset, setPanOffset,
      tripModalOpen, setTripModalOpen,
      editingTrip, setEditingTrip,
    }}>
      {children}
    </MapStoreContext.Provider>
  )
}

export function useMapStore() {
  const ctx = useContext(MapStoreContext)
  if (!ctx) throw new Error('useMapStore must be used inside MapStoreProvider')
  return ctx
}
