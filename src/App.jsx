import { useAuth } from '@/hooks/useAuth'
import { useTrips } from '@/hooks/useTrips'
import { MapStoreProvider } from '@/store/mapStore'
import { Topbar } from '@/components/layout/Topbar'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { MapPage } from '@/pages/MapPage'

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth()
  const { trips, loading: tripsLoading, addTrip, updateTrip, deleteTrip, visitedCountryCodes } = useTrips(user?.id)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 rounded-full border-2 border-[var(--color-primary-500)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onSignIn={signInWithGoogle} />
  }

  return (
    <MapStoreProvider>
      <div className="flex flex-col h-full">
        <Topbar user={user} onSignOut={signOut} />
        <MapPage
          trips={trips}
          visitedCountryCodes={visitedCountryCodes}
          onAddTrip={addTrip}
          onUpdateTrip={updateTrip}
          onDeleteTrip={deleteTrip}
        />
      </div>
    </MapStoreProvider>
  )
}
