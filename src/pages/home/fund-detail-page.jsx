import { ArrowLeft, TrendingUp, DollarSign, Calendar, Building2, BarChart3, Droplets } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/layout/sidebar'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
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
  return `${value.toFixed(decimals)}%`
}

function formatSignedPercentage(value, decimals = 2) {
  if (value == null) return '—'
  const formatted = formatPercentage(value, decimals)
  return value > 0 ? `+${formatted}` : formatted
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
    <div className={cn('flex min-w-0 flex-col gap-1 rounded-lg bg-muted/30 p-3', className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('break-words text-lg font-bold', highlight && 'text-primary')}>{value}</p>
    </div>
  )
}

function ReadingCard({ label, value, description, tone = 'default' }) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      tone === 'positive' && 'border-green-500/30 bg-green-500/10',
      tone === 'warning' && 'border-amber-500/30 bg-amber-500/10',
      tone === 'neutral' && 'border-blue-500/30 bg-blue-500/10',
      tone === 'default' && 'border-border bg-card'
    )}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn(
        'mt-1 text-2xl font-bold',
        tone === 'positive' && 'text-green-700 dark:text-green-400',
        tone === 'warning' && 'text-amber-700 dark:text-amber-400',
        tone === 'neutral' && 'text-blue-700 dark:text-blue-400'
      )}>
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function getYieldReading(value) {
  if (value == null) return { text: 'Sem leitura', tone: 'default' }
  if (value >= 8) return { text: 'Renda elevada', tone: 'positive' }
  if (value >= 6) return { text: 'Renda moderada', tone: 'neutral' }
  return { text: 'Renda baixa', tone: 'warning' }
}

function getPriceReading(value) {
  if (value == null) return { text: 'Sem leitura', tone: 'default' }
  if (value < 0.95) return { text: 'Abaixo do patrimônio', tone: 'positive' }
  if (value <= 1.05) return { text: 'Próximo ao patrimônio', tone: 'neutral' }
  return { text: 'Acima do patrimônio', tone: 'warning' }
}

function getLiquidityReading(value) {
  if (value == null) return { text: 'Sem leitura', tone: 'default' }
  if (value >= 500_000) return { text: 'Alta liquidez', tone: 'positive' }
  if (value >= 100_000) return { text: 'Liquidez moderada', tone: 'neutral' }
  return { text: 'Baixa liquidez', tone: 'warning' }
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
        {formatSignedPercentage(value)}
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
  const dividendYield = fund?.detail?.indicators?.dividend_yield ?? fund?.dividend_yield
  const priceToBook = fund?.detail?.indicators?.price_to_book ?? fund?.price_to_book
  const liquidity = fund?.detail?.market?.avg_volume_2m ?? fund?.liquidity
  const yieldReading = getYieldReading(dividendYield)
  const priceReading = getPriceReading(priceToBook)
  const liquidityReading = getLiquidityReading(liquidity)

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
        sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
      )}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <AuthenticatedHeader
            title={ticker?.toUpperCase() ?? 'Detalhe do Fundo'}
            description="Análise detalhada do fundo imobiliário selecionado"
          />

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="ghost"
              className="w-fit"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="size-4" />
              Voltar para Visão Geral
            </Button>
          </div>

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
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
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
                    <div className="rounded-lg bg-muted/50 p-4 sm:min-w-56 sm:text-right">
                      <p className="text-sm text-muted-foreground">Cotação Atual</p>
                      <p className="mt-1 text-3xl font-bold">{formatCurrency(fund.price)}</p>
                      {fund.detail?.market?.last_quote_date && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Última cotação: {fund.detail.market.last_quote_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <ReadingCard
                    label="Renda"
                    value={formatPercentage(dividendYield)}
                    description={yieldReading.text}
                    tone={yieldReading.tone}
                  />
                  <ReadingCard
                    label="Preço em relação ao patrimônio"
                    value={formatNumber(priceToBook, 2)}
                    description={priceReading.text}
                    tone={priceReading.tone}
                  />
                  <ReadingCard
                    label="Facilidade para negociar"
                    value={formatCompactCurrency(liquidity)}
                    description={liquidityReading.text}
                    tone={liquidityReading.tone}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm font-medium text-foreground">Leitura do ativo</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Esta página consolida preço, renda, patrimônio, liquidez e informações operacionais do fundo para apoiar uma análise objetiva.
                    </p>
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

              <InfoSection title="Renda e Preço" icon={TrendingUp}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <MetricItem
                    label="Rendimento anual"
                    value={formatPercentage(dividendYield, 2)}
                    highlight={true}
                  />
                  <MetricItem
                    label="Resultado operacional sobre preço"
                    value={formatPercentage(fund.detail?.indicators?.ffo_yield, 2)}
                  />
                  <MetricItem
                    label="Preço vs patrimônio"
                    value={formatNumber(priceToBook, 2)}
                    highlight={priceToBook < 1}
                  />
                  <MetricItem
                    label="Dividendo por Cota"
                    value={formatCurrency(fund.detail?.indicators?.dividend_per_share)}
                  />
                  <MetricItem
                    label="Resultado por Cota"
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
                    {fund.detail.results.last_12m_asset_sales != null && (
                      <MetricItem
                        label="Venda de Ativos (12M)"
                        value={formatCompactCurrency(fund.detail.results.last_12m_asset_sales)}
                      />
                    )}
                    {fund.detail.results.last_3m_asset_sales != null && (
                      <MetricItem
                        label="Venda de Ativos (3M)"
                        value={formatCompactCurrency(fund.detail.results.last_3m_asset_sales)}
                      />
                    )}
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
                    label="Volume Médio Diário"
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
                <InfoSection title="Patrimônio" icon={DollarSign}>
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
                <InfoSection title="Imóveis e Ocupação" icon={Building2}>
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
                      label="Retorno dos Imóveis"
                      value={fund.detail.properties.cap_rate != null ? formatPercentage(fund.detail.properties.cap_rate) : '—'}
                    />
                    <MetricItem
                      label="Vacância Média"
                      value={fund.detail.properties.avg_vacancy != null ? formatPercentage(fund.detail.properties.avg_vacancy) : '—'}
                    />
                    <MetricItem
                      label="Participação no Patrimônio"
                      value={fund.detail.properties.to_equity_percent != null ? formatPercentage(fund.detail.properties.to_equity_percent) : '—'}
                    />
                  </div>
                </InfoSection>
              )}

              {/* Histórico de Oscilações Anuais */}
              {fund.detail?.market?.oscillations?.yearly && (
                <InfoSection title="Variação Anual" icon={Calendar}>
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
