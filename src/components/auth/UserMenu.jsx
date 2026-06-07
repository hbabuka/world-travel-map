// TODO: avatar dropdown with sign-out option
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function UserMenu({ user, onSignOut }) {
  const initials = (user?.email ?? '?').slice(0, 2).toUpperCase()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="h-8 w-8 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] text-sm font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]">
          {initials}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-[var(--radius-md)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)] border border-[var(--color-border)] p-1"
          align="end"
          sideOffset={6}
        >
          <div className="px-2 py-1.5 text-xs text-[var(--color-text-muted)] truncate">{user?.email}</div>
          <DropdownMenu.Separator className="h-px bg-[var(--color-border)] my-1" />
          <DropdownMenu.Item
            className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm cursor-pointer hover:bg-[var(--color-surface-2)] focus:outline-none"
            onSelect={onSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
