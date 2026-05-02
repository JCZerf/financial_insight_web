import { LogOut, TrendingUp, DollarSign, Droplets, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sidebar } from '@/components/layout/sidebar'
import { BestOpportunityCard } from '@/components/dashboard/best-opportunity-card'
import { FundsList } from '@/components/dashboard/funds-list'
import { HelpButton } from '@/components/dashboard/help-button'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { fetchDashboard } from '@/lib/api-client'
import { cn } from '@/lib/utils'

export function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <header className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Análise de Fundos Imobiliários
              </p>
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

        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
          </Alert>
        )}

        {dashboard && !loading && (
          <>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Visão Geral do Mercado
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Panorama do mercado com base em {dashboard.metadata?.ranked_funds ?? 0} fundos imobiliários
              </p>
              <SummaryCards summary={dashboard.summary} />
            </div>

            <BestOpportunityCard fund={dashboard.summary?.best_opportunity} />

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Informações da Base de Dados
              </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total de FIIs</span>
                      <span className="text-sm font-semibold text-foreground">
                        {dashboard.metadata?.total_funds ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fundos analisados</span>
                      <span className="text-sm font-semibold text-foreground">
                        {dashboard.metadata?.ranked_funds ?? 0}
                      </span>
                    </div>
                    {dashboard.metadata?.latest_collected_at_utc && (
                      <div className="mt-3 border-t border-border pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">Última atualização:</span>
                          <span className="text-xs font-medium text-foreground">
                            {new Date(dashboard.metadata.latest_collected_at_utc).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                            {' às '}
                            {new Date(dashboard.metadata.latest_collected_at_utc).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
              </div>
            </div>

            <Tabs defaultValue="opportunities" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
                <TabsTrigger value="dividend">Maiores Rendimentos</TabsTrigger>
                <TabsTrigger value="discounted">Descontados</TabsTrigger>
                <TabsTrigger value="liquid">Mais Líquidos</TabsTrigger>
              </TabsList>

              <TabsContent value="opportunities" className="mt-6">
                <FundsList
                  title="Melhores Oportunidades"
                  description="Fundos com melhor equilíbrio entre rendimento, preço atrativo e facilidade para negociar"
                  funds={dashboard.opportunities}
                  icon={Award}
                  showRank={true}
                />
              </TabsContent>

              <TabsContent value="dividend" className="mt-6">
                <FundsList
                  title="Maiores Rendimentos"
                  description="Fundos que pagam mais dividendos por mês"
                  funds={dashboard.high_dividend}
                  icon={TrendingUp}
                  showRank={false}
                />
              </TabsContent>

              <TabsContent value="discounted" className="mt-6">
                <FundsList
                  title="Fundos Descontados"
                  description="Fundos negociando abaixo do valor patrimonial (P/VP < 1.0)"
                  funds={dashboard.discounted}
                  icon={DollarSign}
                  showRank={false}
                />
              </TabsContent>

              <TabsContent value="liquid" className="mt-6">
                <FundsList
                  title="Fundos Mais Líquidos"
                  description="Fundos com maior volume de negociação"
                  funds={dashboard.most_liquid}
                  icon={Droplets}
                  showRank={false}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
        </div>
      </main>
      
      <HelpButton />
    </div>
  )
}
