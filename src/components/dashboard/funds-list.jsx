import { TrendingUp, Building2, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/home/fundo/${fund.ticker}`)
  }

  return (
    <div 
      onClick={handleClick}
      className="flex cursor-pointer items-center gap-4 border-b border-border py-3.5 last:border-0 hover:bg-muted/50 transition-colors"
    >
      {showRank && fund.rank && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {fund.rank}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-base font-bold">{fund.ticker}</p>
          {fund.segment && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {fund.segment}
            </span>
          )}
        </div>
        {fund.name && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{fund.name}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Preço</p>
          <p className="text-sm font-bold">{formatCurrency(fund.price)}</p>
        </div>
        {fund.dividend_yield != null && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Rendimento</p>
            <p className="text-sm font-bold text-green-600">
              {formatPercentage(fund.dividend_yield)}
            </p>
          </div>
        )}
        {fund.price_to_book != null && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">P/VP</p>
            <p className={`text-sm font-bold ${fund.price_to_book < 1 ? 'text-green-600' : 'text-foreground'}`}>
              {formatNumber(fund.price_to_book, 2)}
            </p>
          </div>
        )}
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
