import { ArrowLeft, TrendingUp, DollarSign, Calendar, Building2, BarChart3, Droplets } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/sidebar'
import { fetchFundDetail } from '@/lib/api-client'
import { cn } from '@/lib/utils'

function formatCurrency(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatPercentage(value, decimals = 2) {
  if (value == null) return '—'
  const formatted = value.toFixed(decimals)
  return value > 0 ? `+${formatted}%` : `${formatted}%`
}

function formatNumber(value, decimals = 0) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function formatCompactCurrency(value) {
  if (value == null) return '—'
  
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(2)} bi`
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)} mi`
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(2)} mil`
  }
  return formatCurrency(value)
}

function MetricItem({ label, value, className = '', highlight = false }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-lg font-bold', highlight && 'text-primary')}>{value}</p>
    </div>
  )
}

function OscillationBadge({ label, value }) {
  if (value == null) return null
  
  const isPositive = value > 0
  const isNegative = value < 0
  
  return (
    <div className={cn(
      'rounded-lg border px-3 py-2',
      isPositive && 'border-green-500/30 bg-green-500/10',
      isNegative && 'border-red-500/30 bg-red-500/10',
      !isPositive && !isNegative && 'border-muted bg-muted/30'
    )}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn(
        'mt-1 text-base font-bold',
        isPositive && 'text-green-600',
        isNegative && 'text-red-600'
      )}>
        {formatPercentage(value)}
      </p>
    </div>
  )
}

function InfoSection({ title, icon: Icon, children }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-5 text-primary" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function FundDetailPage() {
  const { ticker } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fund, setFund] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    async function loadFundDetail() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchFundDetail(ticker)
        setFund(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (ticker) {
      loadFundDetail()
    }
  }, [ticker])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/home"
      />
      
      <main className={cn(
        'flex-1 px-3 py-4 text-foreground transition-all duration-300 sm:px-4',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <header className="flex flex-col gap-3 border-b border-border pb-3">
            <Button
              type="button"
              variant="ghost"
              className="w-fit"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="size-4" />
              Voltar ao Dashboard
            </Button>
          </header>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Carregando detalhes...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}

          {fund && !loading && (
            <>
              {/* Cabeçalho do Fundo */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{fund.ticker}</h1>
                    {fund.segment && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {fund.segment}
                      </span>
                    )}
                  </div>
                  {fund.name && (
                    <p className="mt-2 text-muted-foreground">{fund.name}</p>
                  )}
                  {fund.detail?.identification?.management && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Gestão: {fund.detail.identification.management}
                    </p>
                  )}
                </div>

                {/* Preço Principal e Oscilações */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Cotação Atual</p>
                    <p className="mt-1 text-4xl font-bold">{formatCurrency(fund.price)}</p>
                    {fund.detail?.market?.last_quote_date && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Última cotação: {fund.detail.market.last_quote_date}
                      </p>
                    )}
                  </div>

                  {fund.detail?.market?.oscillations && (
                    <div className="grid grid-cols-2 gap-2">
                      <OscillationBadge label="Dia" value={fund.detail.market.oscillations.day} />
                      <OscillationBadge label="Mês" value={fund.detail.market.oscillations.month} />
                      <OscillationBadge label="12 Meses" value={fund.detail.market.oscillations.months_12} />
                      <OscillationBadge label="No Ano" value={fund.detail.market.oscillations.year_to_date} />
                    </div>
                  )}
                </div>
              </div>

              {/* Indicadores Principais */}
              <InfoSection title="Indicadores de Rentabilidade" icon={TrendingUp}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <MetricItem
                    label="Dividend Yield"
                    value={formatPercentage(fund.detail?.indicators?.dividend_yield ?? fund.dividend_yield, 2)}
                    highlight={true}
                  />
                  <MetricItem
                    label="FFO Yield"
                    value={formatPercentage(fund.detail?.indicators?.ffo_yield, 2)}
                  />
                  <MetricItem
                    label="P/VP"
                    value={formatNumber(fund.detail?.indicators?.price_to_book ?? fund.price_to_book, 2)}
                    highlight={fund.price_to_book < 1}
                  />
                  <MetricItem
                    label="Dividendo por Cota"
                    value={formatCurrency(fund.detail?.indicators?.dividend_per_share)}
                  />
                  <MetricItem
                    label="FFO por Cota"
                    value={formatCurrency(fund.detail?.indicators?.ffo_per_share)}
                  />
                  <MetricItem
                    label="Valor Patrimonial/Cota"
                    value={formatCurrency(fund.detail?.indicators?.book_value_per_share)}
                  />
                </div>
              </InfoSection>

              {/* Resultados Financeiros */}
              {fund.detail?.results && (
                <InfoSection title="Resultados Financeiros" icon={BarChart3}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <MetricItem
                      label="Receita (12M)"
                      value={formatCompactCurrency(fund.detail.results.last_12m_revenue)}
                    />
                    <MetricItem
                      label="Receita (3M)"
                      value={formatCompactCurrency(fund.detail.results.last_3m_revenue)}
                    />
                    <MetricItem
                      label="FFO (12M)"
                      value={formatCompactCurrency(fund.detail.results.last_12m_ffo)}
                    />
                    <MetricItem
                      label="FFO (3M)"
                      value={formatCompactCurrency(fund.detail.results.last_3m_ffo)}
                    />
                    <MetricItem
                      label="Renda Distribuída (12M)"
                      value={formatCompactCurrency(fund.detail.results.last_12m_distributed_income)}
                    />
                    <MetricItem
                      label="Renda Distribuída (3M)"
                      value={formatCompactCurrency(fund.detail.results.last_3m_distributed_income)}
                    />
                  </div>
                </InfoSection>
              )}

              {/* Mercado e Liquidez */}
              <InfoSection title="Mercado e Liquidez" icon={Droplets}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <MetricItem
                    label="Valor de Mercado"
                    value={formatCompactCurrency(fund.detail?.market?.market_value ?? fund.market_value)}
                  />
                  <MetricItem
                    label="Volume Médio (2M)"
                    value={formatCompactCurrency(fund.detail?.market?.avg_volume_2m)}
                  />
                  <MetricItem
                    label="Cotas Emitidas"
                    value={formatNumber(fund.detail?.market?.share_count, 0)}
                  />
                  <MetricItem
                    label="Máxima (52 sem)"
                    value={formatCurrency(fund.detail?.market?.high_52w)}
                  />
                  <MetricItem
                    label="Mínima (52 sem)"
                    value={formatCurrency(fund.detail?.market?.low_52w)}
                  />
                </div>
              </InfoSection>

              {/* Patrimônio */}
              {fund.detail?.balance_sheet && (
                <InfoSection title="Balanço Patrimonial" icon={DollarSign}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <MetricItem
                      label="Patrimônio Líquido"
                      value={formatCompactCurrency(fund.detail.balance_sheet.net_equity)}
                    />
                    <MetricItem
                      label="Ativo Total"
                      value={formatCompactCurrency(fund.detail.balance_sheet.assets)}
                    />
                    {fund.detail.market?.report_date && (
                      <MetricItem
                        label="Data do Balanço"
                        value={fund.detail.market.report_date}
                      />
                    )}
                  </div>
                </InfoSection>
              )}

              {/* Propriedades */}
              {fund.detail?.properties && (
                <InfoSection title="Informações de Propriedades" icon={Building2}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    <MetricItem
                      label="Nº de Imóveis"
                      value={formatNumber(fund.detail.properties.property_count, 0)}
                    />
                    <MetricItem
                      label="Nº de Unidades"
                      value={formatNumber(fund.detail.properties.unit_count, 0)}
                    />
                    <MetricItem
                      label="Área Total (m²)"
                      value={formatNumber(fund.detail.properties.area_sqm, 2)}
                    />
                    <MetricItem
                      label="Preço por m²"
                      value={formatCurrency(fund.detail.properties.price_per_sqm)}
                    />
                    <MetricItem
                      label="Aluguel por m²"
                      value={formatCurrency(fund.detail.properties.rent_per_sqm)}
                    />
                    <MetricItem
                      label="Cap Rate"
                      value={fund.detail.properties.cap_rate != null ? formatPercentage(fund.detail.properties.cap_rate) : '—'}
                    />
                    <MetricItem
                      label="Vacância Média"
                      value={fund.detail.properties.avg_vacancy != null ? formatPercentage(fund.detail.properties.avg_vacancy) : '—'}
                    />
                    <MetricItem
                      label="% do Patrimônio"
                      value={fund.detail.properties.to_equity_percent != null ? formatPercentage(fund.detail.properties.to_equity_percent) : '—'}
                    />
                  </div>
                </InfoSection>
              )}

              {/* Histórico de Oscilações Anuais */}
              {fund.detail?.market?.oscillations?.yearly && (
                <InfoSection title="Performance Anual" icon={Calendar}>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {Object.entries(fund.detail.market.oscillations.yearly)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([year, value]) => (
                        <OscillationBadge key={year} label={year} value={value} />
                      ))}
                  </div>
                </InfoSection>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
