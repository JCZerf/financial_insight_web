import { Home, ChevronLeft, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from '@/assets/financial_insight_logo.png'

export function Sidebar({ className, isCollapsed, onToggle, currentPath = '/home' }) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand com botão de toggle */}
        <div className={cn(
          'relative flex items-center border-b border-border transition-all duration-300',
          isCollapsed ? 'justify-center px-2 py-4' : 'gap-3 px-4 py-4'
        )}>
          <img 
            src={logo} 
            alt="Financial Insight" 
            className="size-9 shrink-0 object-contain"
          />
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-base font-bold text-foreground">Financial Insight</h1>
              <p className="text-xs text-muted-foreground">Análise de FIIs</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            <li>
              <a
                href="/home"
                className={cn(
                  'flex items-center rounded-lg text-sm font-medium transition-colors hover:bg-muted',
                  isCollapsed ? 'justify-center px-3 py-2.5' : 'gap-3 px-3 py-2.5',
                  currentPath === '/home' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Dashboard"
              >
                <Home className="size-5 shrink-0" />
                {!isCollapsed && 'Dashboard'}
              </a>
            </li>
            <li>
              <a
                href="/perfil"
                className={cn(
                  'flex items-center rounded-lg text-sm font-medium transition-colors hover:bg-muted',
                  isCollapsed ? 'justify-center px-3 py-2.5' : 'gap-3 px-3 py-2.5',
                  currentPath === '/perfil' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Perfil"
              >
                <User className="size-5 shrink-0" />
                {!isCollapsed && 'Perfil'}
              </a>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              © 2026 Financial Insight
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
