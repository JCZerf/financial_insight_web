import { TrendingUp, Building2, Award } from 'lucide-react'

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

function FundRow({ fund, showRank = false }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {showRank && fund.rank && (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {fund.rank}
            </span>
          )}
          <div>
            <p className="font-semibold">{fund.ticker}</p>
            {fund.name && (
              <p className="text-xs text-muted-foreground">{fund.name}</p>
            )}
            {fund.segment && (
              <span className="text-xs text-muted-foreground">{fund.segment}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <p className="font-semibold">{formatCurrency(fund.price)}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          {fund.dividend_yield != null && (
            <span className="text-green-600">
              DY: {formatPercentage(fund.dividend_yield)}
            </span>
          )}
          {fund.price_to_book != null && (
            <span>
              P/VP: {formatNumber(fund.price_to_book, 2)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FundsList({ title, description, funds, icon: Icon, showRank = false }) {
  if (!funds || funds.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-5 text-primary" />}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {funds.map((fund) => (
            <FundRow key={fund.ticker} fund={fund} showRank={showRank} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
