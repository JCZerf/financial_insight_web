import { TrendingUp, Percent, DollarSign, Droplets } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatCurrency(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercentage(value, decimals = 2) {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

function formatNumber(value, decimals = 0) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function getYieldStatus(value) {
  if (value == null) return 'sem leitura'
  if (value >= 8) return 'renda alta'
  if (value >= 6) return 'renda ok'
  return 'renda baixa'
}

function getPvpStatus(value) {
  if (value == null) return 'sem leitura'
  if (value < 0.95) return 'mais barato'
  if (value <= 1.05) return 'perto do justo'
  return 'mais caro'
}

function getLiquidityStatus(value) {
  if (value == null) return 'sem leitura'
  if (value >= 500_000) return 'fácil de negociar'
  if (value >= 100_000) return 'negociação ok'
  return 'pouco negociado'
}

export function SummaryCards({ summary }) {
  if (!summary) return null

  const dyValue = summary.average_dividend_yield
  const dyColor = dyValue >= 8 ? 'text-green-600 dark:text-green-400' : dyValue >= 6 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
  
  const pvpValue = summary.median_price_to_book
  const pvpColor = pvpValue < 0.95 ? 'text-green-600 dark:text-green-400' : pvpValue <= 1.05 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-green-500 transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Rendimento Médio</CardTitle>
            <div className="rounded-full bg-green-500/10 p-1.5">
              <Percent className="size-3.5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className={`text-2xl font-bold ${dyColor}`}>
            {formatPercentage(summary.average_dividend_yield)}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            ao ano · {getYieldStatus(dyValue)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500 transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Preço vs Patrimônio</CardTitle>
            <div className="rounded-full bg-blue-500/10 p-1.5">
              <DollarSign className="size-3.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className={`text-2xl font-bold ${pvpColor}`}>
            {summary.median_price_to_book != null 
              ? formatNumber(summary.median_price_to_book, 2) 
              : '—'}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {getPvpStatus(pvpValue)} · P/VP mediano
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-cyan-500 transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Liquidez Média</CardTitle>
            <div className="rounded-full bg-cyan-500/10 p-1.5">
              <Droplets className="size-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(summary.average_liquidity)}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            volume diário · {getLiquidityStatus(summary.average_liquidity)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500 transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">Fundos Mais Baratos</CardTitle>
            <div className="rounded-full bg-emerald-500/10 p-1.5">
              <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {summary.discounted_funds_count ?? 0}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            abaixo do patrimônio estimado
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
