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
          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <TrendingUp className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Renda do Fundo</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mostra quanto o fundo costuma pagar de rendimentos em relação ao preço da cota
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

          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <DollarSign className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Preço vs Patrimônio</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compara o preço da cota com o valor patrimonial estimado do fundo
                </p>
              </div>
            </div>
            <div className="ml-6 mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-green-500/10 px-3 py-2">
                <div className="font-semibold text-green-700 dark:text-green-400">Abaixo de 1.0</div>
                <div className="text-xs text-muted-foreground">Pode estar mais barato</div>
              </div>
              <div className="rounded-md bg-yellow-500/10 px-3 py-2">
                <div className="font-semibold text-yellow-700 dark:text-yellow-400">Perto de 1.0</div>
                <div className="text-xs text-muted-foreground">Perto do patrimônio</div>
              </div>
              <div className="rounded-md bg-red-500/10 px-3 py-2">
                <div className="font-semibold text-red-700 dark:text-red-400">Acima de 1.0</div>
                <div className="text-xs text-muted-foreground">Pode estar mais caro</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-background/50 p-4">
            <div className="mb-2 flex items-start gap-2">
              <Droplets className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Facilidade para Negociar</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mostra quanto dinheiro costuma ser negociado por dia. Quanto maior, mais fácil comprar ou vender
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

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-start gap-2">
              <Award className="mt-0.5 size-4 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300">
                  Dica de Análise
              </h3>
              <p className="mt-1.5 text-sm text-amber-800 dark:text-amber-200">
                  Uma boa oportunidade costuma juntar <strong>boa renda</strong>, <strong>preço interessante</strong> e <strong>facilidade para negociar</strong>. Evite decidir olhando apenas um número isolado.
              </p>
            </div>
          </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
