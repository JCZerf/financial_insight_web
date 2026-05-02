import { TrendingUp, TrendingDown, Building2, Percent, DollarSign, Droplets } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

function formatNumber(value, decimals = 0) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function SummaryCards({ summary }) {
  if (!summary) return null

  const dyValue = summary.average_dividend_yield
  const dyColor = dyValue >= 8 ? 'text-green-600' : dyValue >= 6 ? 'text-blue-600' : 'text-orange-600'
  
  const pvpValue = summary.median_price_to_book
  const pvpColor = pvpValue < 0.95 ? 'text-green-600' : pvpValue <= 1.05 ? 'text-blue-600' : 'text-orange-600'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rendimento Médio</CardTitle>
          <Percent className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${dyColor}`}>
            {formatPercentage(summary.average_dividend_yield)}
          </div>
          <p className="text-xs text-muted-foreground">
            ao ano
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">P/VP Mediano</CardTitle>
          <TrendingDown className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${pvpColor}`}>
            {summary.median_price_to_book != null 
              ? formatNumber(summary.median_price_to_book, 2) 
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">
            preço / valor patrimonial
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Liquidez Média</CardTitle>
          <Droplets className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.average_liquidity)}
          </div>
          <p className="text-xs text-muted-foreground">
            volume diário
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FIIs Descontados</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {summary.discounted_funds_count ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            com P/VP abaixo de 1.0
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
