# Financial Insight — Identidade Visual

## Fundamentos

- Fonte principal: `Inter`
- Diretriz: tipografia moderna e otimizada para telas
- Motivo: boa legibilidade em interfaces densas e numeros com alinhamento consistente para tabelas e dashboards

## Paleta Base

### Marca

| Token | Light | Dark | Uso |
|---|---|---|---|
| `brand` | `#00897B` | `#26A69A` | Cor institucional principal, CTAs, destaques de navegacao e elementos de identidade |
| `brand-foreground` | `#F8FAFC` | `#081311` | Texto e icones sobre a cor de marca |

### Neutros

| Token | Light | Dark | Uso |
|---|---|---|---|
| `background` | `#F7F8FA` | `#0F1117` | Fundo geral da pagina |
| `card` | `#FFFFFF` | `#181B24` | Cards, modais e superficies elevadas |
| `foreground` | `#0F1117` | `#F7F8FA` | Texto principal |
| `text-secondary` | `#5C6070` | `#A0A7B5` | Labels, apoio visual, descricoes e metadados |
| `border` | `#DFE4EA` | `#2B3340` | Bordas sutis e divisores |
| `muted` | `#F1F3F6` | `#1C212C` | Areas suaves, backgrounds secundarios e placeholders |

## Cores Semanticas Financeiras

Essas cores sao exclusivas para dados financeiros. Elas nao devem ser reutilizadas em botoes primarios, links principais, navegacao, badges institucionais ou qualquer outro elemento de UI generico.

| Token | Light | Dark | Uso |
|---|---|---|---|
| `financial-positive` | `#2E7D52` | `#4CAF7A` | Alta, ganho, valorizacao, rentabilidade positiva |
| `financial-negative` | `#C62828` | `#EF5350` | Queda, perda, desvalorizacao, rentabilidade negativa |
| `financial-warning` | `#B45309` | `#D97706` | Alertas de negocio, vacancia alta, liquidez baixa, atencao operacional |

## Regras de Uso

### Marca

- O verde da marca representa identidade institucional, nao performance financeira.
- `brand` deve aparecer em:
  - CTA principal
  - foco ativo
  - links de destaque
  - elementos de navegacao e selecao

### Dados financeiros

- Nunca usar `brand` para indicar lucro, alta ou rentabilidade.
- Nunca usar `financial-positive` como cor principal de botoes ou identidade da pagina.
- A leitura correta deve ser:
  - `brand` = produto e marca
  - `financial-positive` = dado positivo
  - `financial-negative` = dado negativo
  - `financial-warning` = alerta analitico

### Texto e contraste

- `foreground` para texto principal e titulos.
- `text-secondary` para labels, descricoes e contexto de apoio.
- Cards devem manter contraste alto com o fundo geral.
- No dark mode, os tons semanticos ficam levemente mais vivos para preservar leitura.

## Tokens Globais do Projeto

Os tokens foram centralizados em [src/index.css](/home/jcarlos/Documents/work-projects/financial_insight_web/src/index.css) e devem ser consumidos via classes utilitarias do Tailwind ou variaveis CSS expostas pelo tema.

Tokens disponiveis:

- `background`
- `foreground`
- `card`
- `primary`
- `accent`
- `text-secondary`
- `financial-positive`
- `financial-negative`
- `financial-warning`

## Diretrizes de Componentes

- Botoes primarios: usar `brand`
- Botoes secundarios: base neutra com borda sutil
- Badges institucionais: usar `brand` ou neutros
- Badges de performance: usar somente tokens financeiros
- Cards: fundo `card` com borda `border`
- Labels e microcopy: `text-secondary`
- Inputs focados: `ring` derivado da cor de marca

## Implementacao Atual

- Fonte global configurada para `Inter`
- Light mode configurado com os neutros definidos
- Dark mode configurado com superfícies `#0F1117` e `#181B24`
- Tokens semanticos financeiros separados da cor de marca
