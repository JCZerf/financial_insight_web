import { Award, TrendingUp, Building2 } from 'lucide-react'

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

export function BestOpportunityCard({ fund }) {
  if (!fund) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <CardTitle className="text-lg">Melhor Oportunidade</CardTitle>
          </div>
          <CardDescription>
            Fundo com maior pontuação geral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum fundo disponível no momento
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="size-5 text-primary" />
          <CardTitle className="text-lg">Melhor Oportunidade</CardTitle>
        </div>
        <CardDescription>
          Fundo com maior pontuação geral
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">{fund.ticker}</h3>
            {fund.name && (
              <p className="text-sm text-muted-foreground">{fund.name}</p>
            )}
            {fund.segment && (
              <p className="text-xs text-muted-foreground">{fund.segment}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Preço</p>
              <p className="text-lg font-semibold">{formatCurrency(fund.price)}</p>
            </div>
            {fund.score != null && (
              <div>
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="text-lg font-semibold">{formatNumber(fund.score, 2)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg bg-background p-3">
            <div>
              <p className="text-xs text-muted-foreground">DY</p>
              <p className="font-semibold text-green-600">
                {formatPercentage(fund.dividend_yield)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">P/VP</p>
              <p className="font-semibold">
                {formatNumber(fund.price_to_book, 2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Liquidez</p>
              <p className="text-xs font-semibold">
                {formatCurrency(fund.liquidity)}
              </p>
            </div>
          </div>

          {fund.property_count != null && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="size-3" />
                <span>{fund.property_count} imóveis</span>
              </div>
              {fund.avg_vacancy != null && (
                <span>Vacância: {formatPercentage(fund.avg_vacancy)}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
