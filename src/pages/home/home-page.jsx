import { BarChart3, LogOut, TrendingUp, DollarSign, Droplets, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BestOpportunityCard } from '@/components/dashboard/best-opportunity-card'
import { FundsList } from '@/components/dashboard/funds-list'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { fetchDashboard } from '@/lib/api-client'

export function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboard, setDashboard] = useState(null)

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
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Dashboard FIIs</h1>
              <p className="text-sm text-muted-foreground">
                Análise de Fundos Imobiliários
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
            <SummaryCards summary={dashboard.summary} />

            <div className="grid gap-6 lg:grid-cols-2">
              <BestOpportunityCard fund={dashboard.summary?.best_opportunity} />
              
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-2 font-semibold">Informações do Dataset</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Total de fundos: {dashboard.metadata?.total_funds ?? 0}</p>
                    <p>Fundos ranqueados: {dashboard.metadata?.ranked_funds ?? 0}</p>
                    {dashboard.metadata?.latest_collected_at_utc && (
                      <p className="text-xs">
                        Última coleta:{' '}
                        {new Date(dashboard.metadata.latest_collected_at_utc).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="opportunities" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
                <TabsTrigger value="dividend">Alto DY</TabsTrigger>
                <TabsTrigger value="discounted">Descontados</TabsTrigger>
                <TabsTrigger value="liquid">Mais Líquidos</TabsTrigger>
              </TabsList>

              <TabsContent value="opportunities" className="mt-6">
                <FundsList
                  title="Melhores Oportunidades"
                  description="Fundos ranqueados pela combinação de DY, P/VP e liquidez"
                  funds={dashboard.opportunities}
                  icon={Award}
                  showRank={true}
                />
              </TabsContent>

              <TabsContent value="dividend" className="mt-6">
                <FundsList
                  title="Fundos com Alto Dividend Yield"
                  description="Fundos com maiores rendimentos mensais"
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
  )
}
