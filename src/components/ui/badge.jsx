import { cn } from '@/lib/utils'

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
    outline: 'border border-[var(--color-border)] text-[var(--color-text-muted)]',
    success: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span
      className={cn('inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
      {...props}
    />
  )
}
