import { ListFilter, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AnalysisFilters } from '@/components/dashboard/analysis-filters'
import { FundsList } from '@/components/dashboard/funds-list'
import { Sidebar } from '@/components/layout/sidebar'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { fetchDashboard, fetchFundsList } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const DEFAULT_ANALYSIS_FILTERS = {
  segment: '',
  min_dividend_yield: '',
  max_price_to_book: '',
  min_liquidity: '',
  limit: '10',
}

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null)
  )
}

export function AnalysisPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [segments, setSegments] = useState([])
  const [results, setResults] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_ANALYSIS_FILTERS)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  async function loadResults(nextFilters = filters) {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchFundsList(cleanFilters(nextFilters))
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    async function loadFilterOptions() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDashboard(cleanFilters({ limit: '1' }))
        if (isActive) {
          setSegments(data.segments ?? [])
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

    loadFilterOptions()

    return () => {
      isActive = false
    }
  }, [])

  function handleApplyFilters(event) {
    event.preventDefault()
    loadResults(filters)
  }

  function handleResetFilters() {
    setFilters(DEFAULT_ANALYSIS_FILTERS)
    setResults(null)
    setError(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/analise"
      />

      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <AuthenticatedHeader
            title="Análise de Fundos"
            description="Aplicação de critérios personalizados para triagem de fundos imobiliários."
          />

          {loading && segments.length === 0 && !results && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}

          <AnalysisFilters
            filters={filters}
            segments={segments}
            loading={loading}
            onChange={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          {!results && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="size-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Defina os critérios para iniciar a triagem.
                </p>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Esta tela retorna apenas os fundos compatíveis com os filtros informados, evitando repetição da Visão Geral.
                </p>
              </CardContent>
            </Card>
          )}

          {results && (
            <>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{results.count ?? 0} fundos encontrados conforme os critérios informados</span>
              </div>

              <FundsList
                title="Fundos Filtrados"
                description="Resultado consolidado da triagem, ordenado pela pontuação objetiva de oportunidade."
                funds={results.results}
                icon={ListFilter}
                showRank={true}
                emptyMessage="Nenhum fundo atende aos critérios escolhidos. Ajuste os filtros e execute uma nova análise."
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
