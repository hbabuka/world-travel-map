// TODO: top navigation bar with logo, search, and user menu
import { Globe } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'

export function Topbar({ user, onSignOut }) {
  return (
    <header className="flex items-center h-12 px-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
      <div className="flex items-center gap-2 mr-auto">
        <Globe className="h-5 w-5 text-[var(--color-primary-500)]" />
        <span className="text-sm font-semibold">World Travel Map</span>
      </div>
      {user && <UserMenu user={user} onSignOut={onSignOut} />}
    </header>
  )
}
