import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ isCollapsed = false }) {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Tema claro' : 'Tema escuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isCollapsed ? 'justify-center' : 'gap-3'
      )}
      aria-label={`Alternar para ${label.toLowerCase()}`}
      title={label}
    >
      {isDark ? (
        <Sun className="size-5 shrink-0" />
      ) : (
        <Moon className="size-5 shrink-0" />
      )}
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}
