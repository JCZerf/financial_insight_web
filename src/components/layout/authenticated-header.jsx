import { LogOut, UserCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Button } from '@/components/ui/button'
import { fetchUserProfile } from '@/lib/api-client'

function getDisplayName(user) {
  if (user?.name) return user.name
  if (user?.email) return user.email.split('@')[0]
  return 'Usuário'
}

export function AuthenticatedHeader({ title, description, user: initialUser = null }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(initialUser)

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
      return
    }

    let isActive = true

    async function loadUser() {
      try {
        const data = await fetchUserProfile()
        if (isActive) {
          setUser(data)
        }
      } catch {
        if (isActive) {
          setUser(null)
        }
      }
    }

    loadUser()

    return () => {
      isActive = false
    }
  }, [initialUser])

  return (
    <header className="flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <UserCircle className="size-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {getDisplayName(user)}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <ThemeToggle isCollapsed />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
