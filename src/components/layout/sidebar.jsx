import { GitCompareArrows, Home, LogOut, PanelLeftClose, PanelLeftOpen, Settings, SlidersHorizontal, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { fetchUserProfile } from '@/lib/api-client'
import logo from '@/assets/financial_insight_logo.png'

const navigationItems = [
  {
    label: 'Visão Geral',
    title: 'Visão Geral do Mercado',
    href: '/home',
    icon: Home,
  },
  {
    label: 'Análise',
    title: 'Análise de Fundos',
    href: '/analise',
    icon: SlidersHorizontal,
  },
  {
    label: 'Comparador',
    title: 'Comparador de FIIs',
    href: '/comparador',
    icon: GitCompareArrows,
  },
  {
    label: 'Perfil',
    title: 'Perfil',
    href: '/perfil',
    icon: User,
  },
]

const adminNavigationItems = [
  {
    label: 'Administração',
    title: 'Administração',
    href: '/administracao',
    icon: Settings,
  },
]

export function Sidebar({ className, isCollapsed, onToggle, currentPath = '/home' }) {
  const navigate = useNavigate()
  const [isSuperuser, setIsSuperuser] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadUser() {
      try {
        const data = await fetchUserProfile()
        if (isActive) {
          setIsSuperuser(Boolean(data.is_superuser))
        }
      } catch {
        if (isActive) {
          setIsSuperuser(false)
        }
      }
    }

    loadUser()

    return () => {
      isActive = false
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card shadow-sm transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-16 md:w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className={cn(
          'relative flex items-center border-b border-border transition-all duration-300',
          isCollapsed ? 'justify-center px-2 py-4' : 'justify-center px-2 py-4 md:justify-start md:gap-3 md:px-4'
        )}>
          <img 
            src={logo} 
            alt="Financial Insight" 
            className="size-9 shrink-0 object-contain"
          />
          {!isCollapsed && (
            <div className="hidden flex-1 md:block">
              <h1 className="text-base font-bold text-foreground">Financial Insight</h1>
              <p className="text-xs text-muted-foreground">Análise de FIIs</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-1">
            {[...navigationItems, ...(isSuperuser ? adminNavigationItems : [])].map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center rounded-lg text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isCollapsed ? 'justify-center px-3 py-2.5' : 'justify-center px-3 py-2.5 md:justify-start md:gap-3',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    title={item.title}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="size-5 shrink-0" />
                    {!isCollapsed && <span className="hidden md:inline">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-border px-2 py-2">
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isCollapsed ? 'justify-center' : 'justify-center md:justify-start md:gap-3'
            )}
            aria-label="Sair da conta"
            title="Sair"
          >
            <LogOut className="size-5 shrink-0" />
            {!isCollapsed && <span className="hidden md:inline">Sair</span>}
          </button>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'hidden w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex',
              isCollapsed ? 'justify-center' : 'gap-3'
            )}
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-5 shrink-0" />
            ) : (
              <PanelLeftClose className="size-5 shrink-0" />
            )}
            {!isCollapsed && <span>Recolher menu</span>}
          </button>
        </div>

        {!isCollapsed && (
          <div className="hidden border-t border-border px-4 py-3 md:block">
            <p className="text-xs text-muted-foreground">
              © 2026 Financial Insight
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
