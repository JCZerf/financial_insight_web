import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Collapsible = React.forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full', className)} {...props}>
    {children}
  </div>
))
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef(
  ({ children, className, isOpen, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-muted/50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'size-5 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef(
  ({ children, className, isOpen, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid transition-all duration-300 ease-in-out',
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        className
      )}
      {...props}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  )
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
