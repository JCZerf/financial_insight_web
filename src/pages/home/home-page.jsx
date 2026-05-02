import { BarChart3, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function HomePage() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Login realizado com sucesso.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-fit rounded-2xl"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </header>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm leading-6 text-muted-foreground">
            Esta e a area inicial autenticada. O dashboard real pode entrar aqui
            na proxima etapa.
          </p>
        </section>
      </div>
    </main>
  )
}
