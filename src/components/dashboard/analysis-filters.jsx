import { Filter, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEFAULT_LIMIT = '10'

const EMPTY_ANALYSIS_FILTERS = {
  segment: '',
  min_dividend_yield: '',
  max_price_to_book: '',
  min_liquidity: '',
  limit: DEFAULT_LIMIT,
}

function Field({ id, label, children, hint }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function AnalysisFilters({
  filters,
  segments = [],
  loading = false,
  onChange,
  onApply,
  onReset,
}) {
  const hasFilters = Boolean(
    filters.segment
      || filters.min_dividend_yield
      || filters.max_price_to_book
      || filters.min_liquidity
      || filters.limit !== EMPTY_ANALYSIS_FILTERS.limit
  )

  function updateFilter(name, value) {
    onChange({ ...filters, [name]: value })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Critérios de Análise</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajuste os parâmetros para filtrar os fundos conforme a estratégia de análise.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_0.7fr_auto]" onSubmit={onApply}>
          <Field id="segment" label="Segmento">
            <select
              id="segment"
              value={filters.segment}
              onChange={(event) => updateFilter('segment', event.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Todos</option>
              {segments.map((item) => (
                <option key={item.segment} value={item.segment}>
                  {item.segment}
                </option>
              ))}
            </select>
          </Field>

          <Field id="min_dividend_yield" label="Rendimento mínimo" hint="Percentual ao ano">
            <Input
              id="min_dividend_yield"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              placeholder="Ex.: 8"
              value={filters.min_dividend_yield}
              onChange={(event) => updateFilter('min_dividend_yield', event.target.value)}
            />
          </Field>

          <Field id="max_price_to_book" label="Preço/patrimônio máximo" hint="Ex.: 1.0 para abaixo do patrimônio">
            <Input
              id="max_price_to_book"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex.: 1"
              value={filters.max_price_to_book}
              onChange={(event) => updateFilter('max_price_to_book', event.target.value)}
            />
          </Field>

          <Field id="min_liquidity" label="Liquidez mínima" hint="Volume médio diário em reais">
            <Input
              id="min_liquidity"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="Ex.: 500000"
              value={filters.min_liquidity}
              onChange={(event) => updateFilter('min_liquidity', event.target.value)}
            />
          </Field>

          <Field id="limit" label="Itens por bloco">
            <Input
              id="limit"
              type="number"
              min="1"
              max="50"
              step="1"
              inputMode="numeric"
              value={filters.limit}
              onChange={(event) => updateFilter('limit', event.target.value)}
            />
          </Field>

          <div className="flex items-end gap-2">
            <Button type="submit" disabled={loading}>
              Aplicar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading || !hasFilters}
              onClick={onReset}
              title="Limpar critérios"
              aria-label="Limpar critérios"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
