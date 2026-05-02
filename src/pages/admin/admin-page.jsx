import { DatabaseZap, Play, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { Sidebar } from '@/components/layout/sidebar'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchUserProfile, runAdminIngestion } from '@/lib/api-client'
import { cn } from '@/lib/utils'

function formatDuration(value) {
  if (value == null) return '—'
  return `${Number(value).toFixed(2)}s`
}

export function AdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('basic')
  const [limit, setLimit] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let isActive = true

    async function loadUser() {
      try {
        const data = await fetchUserProfile()
        if (isActive) {
          setUser(data)
        }
      } catch (err) {
        if (isActive) {
          setError(err.message)
        }
      } finally {
        if (isActive) {
          setLoadingUser(false)
        }
      }
    }

    loadUser()

    return () => {
      isActive = false
    }
  }, [])

  async function handleRunIngestion(event) {
    event.preventDefault()

    try {
      setRunning(true)
      setError(null)
      setResult(null)
      const payload = {
        mode,
        limit: limit ? Number(limit) : null,
      }
      const data = await runAdminIngestion(payload)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  if (!loadingUser && user && !user.is_superuser) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/administracao"
      />

      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <AuthenticatedHeader
            title="Administração"
            description="Execução manual da atualização dos dados de Fundos Imobiliários."
            user={user}
          />

          {loadingUser && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Verificando permissões...</p>
            </div>
          )}

          {!loadingUser && user?.is_superuser && (
            <>
              {error && (
                <Alert variant="destructive">
                  <p>{error}</p>
                </Alert>
              )}

              <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300">
                <ShieldAlert className="size-4" />
                <p>
                  Esta ação executa o coletor manualmente e pode levar alguns minutos, principalmente no modo com detalhes.
                </p>
              </Alert>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DatabaseZap className="size-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Atualização Manual</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Escolha o tipo de extração que será executada pelo bot.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRunIngestion} className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className={cn(
                        'cursor-pointer rounded-lg border p-4 transition-colors',
                        mode === 'basic' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/40'
                      )}>
                        <input
                          type="radio"
                          name="mode"
                          value="basic"
                          checked={mode === 'basic'}
                          onChange={(event) => setMode(event.target.value)}
                          className="sr-only"
                        />
                        <p className="font-semibold">Extração simples</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Atualiza a tabela geral com ticker, preço, rendimento, preço/patrimônio e liquidez.
                        </p>
                      </label>

                      <label className={cn(
                        'cursor-pointer rounded-lg border p-4 transition-colors',
                        mode === 'detailed' ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/40'
                      )}>
                        <input
                          type="radio"
                          name="mode"
                          value="detailed"
                          checked={mode === 'detailed'}
                          onChange={(event) => setMode(event.target.value)}
                          className="sr-only"
                        />
                        <p className="font-semibold">Extração com detalhes</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Atualiza a tabela geral e também consulta a página detalhada de cada fundo.
                        </p>
                      </label>
                    </div>

                    <div className="max-w-xs space-y-2">
                      <Label htmlFor="limit">Limite opcional de fundos</Label>
                      <Input
                        id="limit"
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        placeholder="Sem limite"
                        value={limit}
                        onChange={(event) => setLimit(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use apenas para testes ou atualizações parciais.
                      </p>
                    </div>

                    <Button type="submit" disabled={running}>
                      <Play className="size-4" />
                      {running ? 'Executando atualização...' : 'Executar atualização'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultado da Execução</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Modo</p>
                        <p className="mt-1 font-semibold">{result.mode === 'detailed' ? 'Com detalhes' : 'Simples'}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Run ID</p>
                        <p className="mt-1 break-all font-semibold">{result.run_id}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Dados gerais</p>
                        <p className="mt-1 font-semibold">{result.general_total ?? 0}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Detalhes</p>
                        <p className="mt-1 font-semibold">{result.details_total ?? 0}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Tempo total</p>
                        <p className="mt-1 font-semibold">{formatDuration(result.duration_seconds)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Tempo extração</p>
                        <p className="mt-1 font-semibold">{formatDuration(result.extraction_complete_seconds)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
