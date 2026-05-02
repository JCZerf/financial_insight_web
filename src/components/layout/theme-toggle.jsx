import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ isCollapsed = false, variant = 'menu' }) {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Tema claro' : 'Tema escuro'
  const isHeader = variant === 'header'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex items-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isHeader
          ? 'h-11 rounded-lg border border-border bg-card px-3'
          : 'w-full rounded-lg px-3 py-2.5',
        isCollapsed ? 'justify-center' : 'gap-3',
        isHeader && isCollapsed && 'w-11'
      )}
      aria-label={`Alternar para ${label.toLowerCase()}`}
      title={label}
    >
      {isDark ? (
        <Sun className={cn('shrink-0', isHeader ? 'size-4' : 'size-5')} />
      ) : (
        <Moon className={cn('shrink-0', isHeader ? 'size-4' : 'size-5')} />
      )}
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}
