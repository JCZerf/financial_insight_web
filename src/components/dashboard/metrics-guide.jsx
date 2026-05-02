import { useState } from 'react'
import { TrendingUp, DollarSign, Droplets, Award, HelpCircle } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'

export function MetricsGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible className="rounded-lg border border-primary/20 bg-primary/5">
      <CollapsibleTrigger
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" />
          <span className="font-semibold text-primary">
            💡 Como interpretar as métricas
          </span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent isOpen={isOpen}>
        <div className="space-y-5 p-6 pt-2">
          {/* Dividend Yield */}
          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <TrendingUp className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dividend Yield (DY)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Percentual de rendimento que o fundo paga em relação ao preço da cota
                </p>
              </div>
            </div>
            <div className="ml-6 mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-green-500/10 px-3 py-2">
                <div className="font-semibold text-green-700 dark:text-green-400">✓ Acima de 8%/ano</div>
                <div className="text-xs text-muted-foreground">Rendimento alto</div>
              </div>
              <div className="rounded-md bg-yellow-500/10 px-3 py-2">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400">≈ Entre 6-8%/ano</div>
                <div className="text-xs text-muted-foreground">Rendimento médio</div>
              </div>
              <div className="rounded-md bg-red-500/10 px-3 py-2">
                <div className="font-semibold text-red-700 dark:text-red-400">✗ Abaixo de 6%/ano</div>
                <div className="text-xs text-muted-foreground">Rendimento baixo</div>
              </div>
            </div>
          </div>

          {/* P/VP */}
          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <DollarSign className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Preço sobre Valor Patrimonial (P/VP)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Indica se o fundo está sendo negociado com desconto ou prêmio em relação ao seu patrimônio
                </p>
              </div>
            </div>
            <div className="ml-6 mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-green-500/10 px-3 py-2">
                <div className="font-semibold text-green-700 dark:text-green-400">✓ P/VP &lt; 1.0</div>
                <div className="text-xs text-muted-foreground">Negociando com desconto</div>
              </div>
              <div className="rounded-md bg-yellow-500/10 px-3 py-2">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400">≈ P/VP ≈ 1.0</div>
                <div className="text-xs text-muted-foreground">Preço justo</div>
              </div>
              <div className="rounded-md bg-red-500/10 px-3 py-2">
                <div className="font-semibold text-red-700 dark:text-red-400">✗ P/VP &gt; 1.0</div>
                <div className="text-xs text-muted-foreground">Negociando com prêmio</div>
              </div>
            </div>
          </div>

          {/* Liquidez */}
          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <Droplets className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Liquidez Diária</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Volume médio negociado por dia. Maior liquidez facilita compra e venda sem grandes oscilações de preço
                </p>
              </div>
            </div>
            <div className="ml-6 mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-green-500/10 px-3 py-2">
                <div className="font-semibold text-green-700 dark:text-green-400">✓ &gt; R$ 500 mil/dia</div>
                <div className="text-xs text-muted-foreground">Alta liquidez</div>
              </div>
              <div className="rounded-md bg-yellow-500/10 px-3 py-2">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400">≈ R$ 100-500 mil/dia</div>
                <div className="text-xs text-muted-foreground">Liquidez média</div>
              </div>
              <div className="rounded-md bg-red-500/10 px-3 py-2">
                <div className="font-semibold text-red-700 dark:text-red-400">✗ &lt; R$ 100 mil/dia</div>
                <div className="text-xs text-muted-foreground">Baixa liquidez</div>
              </div>
            </div>
          </div>

          {/* Dica importante */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-start gap-2">
              <Award className="mt-0.5 size-4 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300">
                  Dica de Análise
                </h3>
                <p className="mt-1.5 text-sm text-amber-800 dark:text-amber-200">
                  As melhores oportunidades combinam <strong>DY alto</strong> (bons rendimentos), <strong>P/VP baixo</strong> (preço atrativo) e <strong>liquidez adequada</strong> (facilidade para negociar). Não olhe métricas isoladas - a análise conjunta é fundamental!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
