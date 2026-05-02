import { GitCompareArrows, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { Sidebar } from '@/components/layout/sidebar'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchFundDetail, fetchFundsList } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const MAX_FUNDS = 4

function formatCurrency(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatCompactCurrency(value) {
  if (value == null) return '—'
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(2)} bi`
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2)} mi`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(2)} mil`
  return formatCurrency(value)
}

function formatPercentage(value, decimals = 2) {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

function formatNumber(value, decimals = 2) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function getDetailValue(fund, path, fallback) {
  return path.reduce((value, key) => value?.[key], fund) ?? fallback ?? null
}

const comparisonRows = [
  {
    label: 'Rendimento anual',
    description: 'Quanto o fundo paga em relação ao preço da cota.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'indicators', 'dividend_yield'], fund.dividend_yield),
    format: formatPercentage,
    best: 'higher',
  },
  {
    label: 'Preço vs patrimônio',
    description: 'Quanto menor, mais barato em relação ao patrimônio estimado.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'indicators', 'price_to_book'], fund.price_to_book),
    format: (value) => formatNumber(value, 2),
    best: 'lower',
  },
  {
    label: 'Liquidez',
    description: 'Volume negociado, indicando facilidade para comprar ou vender.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'market', 'avg_volume_2m'], fund.liquidity),
    format: formatCompactCurrency,
    best: 'higher',
  },
  {
    label: 'Valor de mercado',
    description: 'Tamanho do fundo em valor de mercado.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'market', 'market_value'], fund.market_value),
    format: formatCompactCurrency,
    best: 'higher',
  },
  {
    label: 'Vacância média',
    description: 'Percentual médio de imóveis vagos.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'properties', 'avg_vacancy'], fund.avg_vacancy),
    format: formatPercentage,
    best: 'lower',
  },
  {
    label: 'Quantidade de imóveis',
    description: 'Número de imóveis do fundo.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'properties', 'property_count'], fund.property_count),
    format: (value) => formatNumber(value, 0),
    best: 'higher',
  },
  {
    label: 'Patrimônio líquido',
    description: 'Patrimônio informado no balanço.',
    getValue: (fund) => getDetailValue(fund, ['detail', 'balance_sheet', 'net_equity']),
    format: formatCompactCurrency,
    best: 'higher',
  },
]

function getBestTickers(funds, row) {
  const values = funds
    .map((fund) => ({ ticker: fund.ticker, value: row.getValue(fund) }))
    .filter((item) => item.value != null)

  if (values.length < 2) return new Set()

  const bestValue = row.best === 'lower'
    ? Math.min(...values.map((item) => item.value))
    : Math.max(...values.map((item) => item.value))

  return new Set(
    values
      .filter((item) => item.value === bestValue)
      .map((item) => item.ticker)
  )
}

function getSummaryBadges(fund) {
  const badges = []
  const dividendYield = getDetailValue(fund, ['detail', 'indicators', 'dividend_yield'], fund.dividend_yield)
  const priceToBook = getDetailValue(fund, ['detail', 'indicators', 'price_to_book'], fund.price_to_book)
  const liquidity = getDetailValue(fund, ['detail', 'market', 'avg_volume_2m'], fund.liquidity)
  const vacancy = getDetailValue(fund, ['detail', 'properties', 'avg_vacancy'], fund.avg_vacancy)

  if (dividendYield >= 8) badges.push('Renda elevada')
  if (priceToBook != null && priceToBook <= 1) badges.push('Preço atrativo')
  if (liquidity >= 500_000) badges.push('Alta liquidez')
  if (vacancy != null && vacancy <= 5) badges.push('Baixa vacância')

  return badges
}

export function ComparePage() {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  const [selectedFunds, setSelectedFunds] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    async function loadOptions() {
      try {
        setLoadingOptions(true)
        const data = await fetchFundsList({ limit: 50 })
        if (isActive) setOptions(data.results ?? [])
      } catch {
        if (isActive) setOptions([])
      } finally {
        if (isActive) setLoadingOptions(false)
      }
    }

    loadOptions()

    return () => {
      isActive = false
    }
  }, [])

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase()
    if (!normalizedQuery) return options.slice(0, 8)

    return options
      .filter((fund) => (
        fund.ticker?.includes(normalizedQuery)
        || fund.name?.toUpperCase().includes(normalizedQuery)
      ))
      .slice(0, 8)
  }, [options, query])

  async function addFund(tickerValue = query) {
    const ticker = tickerValue.trim().toUpperCase()
    if (!ticker) return

    if (selectedFunds.some((fund) => fund.ticker === ticker)) {
      setError(`${ticker} já está na comparação.`)
      return
    }

    if (selectedFunds.length >= MAX_FUNDS) {
      setError(`Compare no máximo ${MAX_FUNDS} fundos por vez.`)
      return
    }

    try {
      setAdding(true)
      setError(null)
      const fund = await fetchFundDetail(ticker)
      setSelectedFunds((currentFunds) => [...currentFunds, fund])
      setQuery('')
    } catch {
      setError(`Não foi possível adicionar ${ticker}. Verifique se o ticker existe na base.`)
    } finally {
      setAdding(false)
    }
  }

  function removeFund(ticker) {
    setSelectedFunds((currentFunds) => currentFunds.filter((fund) => fund.ticker !== ticker))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/comparador"
      />

      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <AuthenticatedHeader
            title="Comparador de FIIs"
            description="Compare fundos lado a lado para avaliar renda, preço, liquidez e dados operacionais."
          />

          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GitCompareArrows className="size-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Selecionar Fundos</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Adicione de 2 a 4 FIIs para comparar os principais critérios de análise.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault()
                  addFund()
                }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value.toUpperCase())}
                    placeholder="Digite o ticker do FII. Ex.: HGLG11"
                    className="pl-9 uppercase"
                  />
                </div>
                <Button type="submit" disabled={adding || selectedFunds.length >= MAX_FUNDS}>
                  <Plus className="size-4" />
                  {adding ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </form>

              <div className="flex flex-wrap gap-2">
                {loadingOptions ? (
                  <p className="text-sm text-muted-foreground">Carregando sugestões...</p>
                ) : (
                  filteredOptions.map((fund) => (
                    <button
                      key={fund.ticker}
                      type="button"
                      onClick={() => addFund(fund.ticker)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {fund.ticker}
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedFunds.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GitCompareArrows className="size-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Nenhum fundo selecionado.
                </p>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Selecione pelo menos dois FIIs para visualizar a comparação lado a lado.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedFunds.length > 0 && (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {selectedFunds.map((fund) => {
                  const badges = getSummaryBadges(fund)

                  return (
                    <Card key={fund.ticker}>
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xl font-bold text-primary">{fund.ticker}</p>
                            {fund.name && (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{fund.name}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFund(fund.ticker)}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`Remover ${fund.ticker}`}
                            title={`Remover ${fund.ticker}`}
                          >
                            <X className="size-4" />
                          </button>
                        </div>

                        {fund.segment && (
                          <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                            {fund.segment}
                          </span>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                          {badges.length > 0 ? badges.map((badge) => (
                            <span key={badge} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              {badge}
                            </span>
                          )) : (
                            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                              Sem destaques automáticos
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {selectedFunds.length < 2 && (
                <Alert>
                  <p>Adicione mais um fundo para que a comparação fique completa.</p>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparação lado a lado</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Os valores destacados indicam o melhor resultado dentro de cada critério comparável.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                      <thead>
                        <tr>
                          <th className="border-b border-border px-3 py-3 text-left font-medium text-muted-foreground">
                            Critério
                          </th>
                          {selectedFunds.map((fund) => (
                            <th key={fund.ticker} className="border-b border-border px-3 py-3 text-left font-medium">
                              {fund.ticker}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonRows.map((row) => {
                          const bestTickers = getBestTickers(selectedFunds, row)

                          return (
                            <tr key={row.label}>
                              <td className="border-b border-border px-3 py-4 align-top">
                                <p className="font-medium text-foreground">{row.label}</p>
                                <p className="mt-1 max-w-xs text-xs text-muted-foreground">{row.description}</p>
                              </td>
                              {selectedFunds.map((fund) => {
                                const value = row.getValue(fund)
                                const isBest = bestTickers.has(fund.ticker)

                                return (
                                  <td key={fund.ticker} className="border-b border-border px-3 py-4 align-top">
                                    <span className={cn(
                                      'inline-flex rounded-md px-2 py-1 font-semibold',
                                      isBest
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground'
                                    )}>
                                      {row.format(value)}
                                    </span>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/home/fundo/${selectedFunds[0].ticker}`)}
                >
                  Ver detalhe de {selectedFunds[0].ticker}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
