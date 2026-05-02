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

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null)
  )
}

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
    let isActive = true

    async function loadInitialDashboard() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDashboard(cleanFilters({ limit: '10' }))
        if (isActive) {
          setDashboard(data)
        }
      } catch (err) {
        if (isActive) {
          setError(err.message)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadInitialDashboard()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/home"
      />
      
      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
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

        {loading && !dashboard && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
          </Alert>
        )}

        {dashboard && (
          <>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Visão Geral do Mercado
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Resumo dos principais fundos imobiliários com maior potencial entre {dashboard.metadata?.ranked_funds ?? 0} FIIs analisados
              </p>
              <SummaryCards summary={dashboard.summary} />
            </div>

            <BestOpportunityCard fund={dashboard.summary?.best_opportunity} />

            <Tabs defaultValue="opportunities" className="w-full">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full lg:w-auto">
                  <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4 lg:w-fit">
                    <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
                    <TabsTrigger value="dividend">Maiores Rendimentos</TabsTrigger>
                    <TabsTrigger value="discounted">Mais Baratos</TabsTrigger>
                    <TabsTrigger value="liquid">Mais Líquidos</TabsTrigger>
                  </TabsList>
                </div>
                
                {dashboard.metadata?.latest_collected_at_utc && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {dashboard.metadata?.ranked_funds ?? 0} de {dashboard.metadata?.total_funds ?? 0} fundos
                    </span>
                    <span>•</span>
                    <span>
                      Atualizado em {new Date(dashboard.metadata.latest_collected_at_utc).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })} às {new Date(dashboard.metadata.latest_collected_at_utc).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <TabsContent value="opportunities" className="mt-6">
                <FundsList
                  title="Melhores Oportunidades"
                  description="Fundos que juntam boa renda, preço interessante e facilidade para comprar ou vender"
                  funds={dashboard.opportunities}
                  icon={Award}
                  showRank={true}
                />
              </TabsContent>

              <TabsContent value="dividend" className="mt-6">
                <FundsList
                  title="Maiores Rendimentos"
                  description="Fundos que mais pagam renda em relação ao preço da cota"
                  funds={dashboard.high_dividend}
                  icon={TrendingUp}
                  showRank={false}
                />
              </TabsContent>

              <TabsContent value="discounted" className="mt-6">
                <FundsList
                  title="Fundos Mais Baratos"
                  description="Fundos sendo negociados por menos do que o valor patrimonial estimado"
                  funds={dashboard.discounted}
                  icon={DollarSign}
                  showRank={false}
                />
              </TabsContent>

              <TabsContent value="liquid" className="mt-6">
                <FundsList
                  title="Fundos Mais Líquidos"
                  description="Fundos com maior facilidade para comprar ou vender no mercado"
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
