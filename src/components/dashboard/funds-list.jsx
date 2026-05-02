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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="flex cursor-pointer flex-col gap-3 border-b border-border py-3.5 transition-colors last:border-0 hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4"
    >
      {showRank && fund.rank && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {fund.rank}
        </div>
      )}
      <div className="w-full flex-1">
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
      <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:flex sm:items-center sm:gap-4">
        <div className="rounded-md bg-muted/40 px-2 py-1.5 sm:bg-transparent sm:p-0 sm:text-right">
          <p className="text-xs text-muted-foreground">Preço</p>
          <p className="text-sm font-bold">{formatCurrency(fund.price)}</p>
        </div>
        {fund.dividend_yield != null && (
          <div className="rounded-md bg-green-500/10 px-2 py-1.5 sm:bg-transparent sm:p-0 sm:text-right">
            <p className="text-xs text-muted-foreground">Renda</p>
            <p className="text-sm font-bold text-green-600">
              {formatPercentage(fund.dividend_yield)}
            </p>
          </div>
        )}
        {fund.price_to_book != null && (
          <div className="rounded-md bg-blue-500/10 px-2 py-1.5 sm:bg-transparent sm:p-0 sm:text-right">
            <p className="text-xs text-muted-foreground">Preço/valor</p>
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
