// TODO: full-page login / landing screen
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LoginScreen({ onSignIn }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div className="flex flex-col items-center gap-3">
        <Globe className="h-14 w-14 text-[var(--color-primary-500)]" />
        <h1 className="text-3xl font-bold tracking-tight">World Travel Map</h1>
        <p className="text-[var(--color-text-muted)] text-center max-w-sm">
          Track every country you've visited, log your trips, and watch your map come alive.
        </p>
      </div>
      <Button size="lg" onClick={onSignIn}>
        Continue with Google
      </Button>
    </div>
  )
}
