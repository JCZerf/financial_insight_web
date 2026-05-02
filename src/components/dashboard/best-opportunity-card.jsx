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
    <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/20 p-2">
            <Award className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Melhor Oportunidade</CardTitle>
            <CardDescription className="mt-0.5">
              Melhor combinação de rendimento, preço e liquidez
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b border-primary/20 pb-3">
            <h3 className="text-2xl font-bold text-primary">{fund.ticker}</h3>
            {fund.name && (
              <p className="mt-0.5 text-sm text-muted-foreground">{fund.name}</p>
            )}
            {fund.segment && (
              <p className="mt-1 text-xs font-medium text-foreground">{fund.segment}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-background/80 p-3">
              <p className="text-xs font-medium text-muted-foreground">Preço da Cota</p>
              <p className="mt-1 text-xl font-bold">{formatCurrency(fund.price)}</p>
            </div>
            {fund.score != null && (
              <div className="rounded-lg bg-background/80 p-3">
                <p className="text-xs font-medium text-muted-foreground">Pontuação</p>
                <p className="mt-1 text-xl font-bold text-primary">{formatNumber(fund.score, 2)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-background/80 p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground">Rendimento</p>
              <p className="mt-1 text-base font-bold text-green-600">
                {formatPercentage(fund.dividend_yield)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">ao ano</p>
            </div>
            <div className="rounded-lg bg-background/80 p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground">P/VP</p>
              <p className="mt-1 text-base font-bold">
                {formatNumber(fund.price_to_book, 2)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fund.price_to_book < 1 ? 'desconto' : 'justo'}
              </p>
            </div>
            <div className="rounded-lg bg-background/80 p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground">Liquidez</p>
              <p className="mt-1 text-sm font-bold">
                {formatCurrency(fund.liquidity)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">diária</p>
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
