import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:   'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]',
        outline:   'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface-2)]',
        ghost:     'hover:bg-[var(--color-surface-2)]',
        danger:    'bg-[var(--color-danger)] text-white hover:opacity-90',
      },
      size: {
        sm:      'h-8 px-3 text-xs',
        default: 'h-9 px-4',
        lg:      'h-11 px-6',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
