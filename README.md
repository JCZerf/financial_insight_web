# Financial Insight Web

Frontend da Financial Insight, uma plataforma para organizar a leitura de indicadores de mercado com foco inicial em FIIs, renda passiva e uma experiencia visual mais objetiva.

O projeto esta em fase inicial funcional: ja possui telas de login, cadastro, validacoes locais, integracao com autenticação JWT e uma rota autenticada provisoria para confirmar o fluxo de acesso.

## Stack

- React
- React Router
- Vite
- Tailwind CSS
- shadcn/ui
- lucide-react

## Requisitos

- Node.js em versao compativel com o Vite instalado no projeto
- npm
- Backend da Financial Insight rodando localmente ou disponivel via URL

## Configuracao

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Em desenvolvimento, o Vite usa proxy para encaminhar chamadas de `/api` para `VITE_API_URL`. Isso evita problemas de CORS no navegador.

## Instalacao

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Por padrao, o Vite sobe em uma porta local disponivel. Durante o desenvolvimento atual, a aplicacao tem sido usada em:

```text
http://127.0.0.1:5174/
```

## Scripts

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run lint
```

Executa a validacao do ESLint.

```bash
npm run build
```

Gera o build de producao.

```bash
npm run preview
```

Serve o build gerado localmente para conferencia.

## Rotas atuais

| Rota | Descricao |
|---|---|
| `/` | Redireciona para `/home` se houver token; caso contrario, para `/login`. |
| `/login` | Tela de login com validacao local e autenticacao JWT. |
| `/cadastro` | Tela de cadastro com mascara de CPF e data brasileira. |
| `/home` | Visao Geral - Dashboard principal com listagens de fundos por categoria. |
| `/home/fundo/:ticker` | Pagina de detalhes completos de um fundo especifico. |
| `/comparador` | Ferramenta de comparacao lado a lado entre fundos. |
| `/analise` | Pagina de analise (em desenvolvimento). |
| `/administracao` | Painel administrativo (em desenvolvimento). |
| `/perfil` | Pagina de perfil do usuario (em desenvolvimento). |

## Autenticacao

O login chama:

```text
/api/auth/jwt/create/
```

Em desenvolvimento, essa rota e encaminhada pelo proxy do Vite para:

```text
{VITE_API_URL}/api/auth/jwt/create/
```

Ao autenticar com sucesso, o front salva `access_token` e `refresh_token` no `localStorage` e redireciona para `/home`.

A protecao de rota atual e simples e verifica apenas a existencia do `access_token`. Validacao de expiracao, refresh automatico e carregamento do usuario autenticado ainda estao pendentes.

## Validacoes de formulario

Login:

- email obrigatorio
- email valido
- senha obrigatoria
- mensagens de erro amigaveis, sem vazamento de respostas tecnicas

Cadastro:

- nome completo
- email valido
- data de nascimento no formato `dd/mm/aaaa`
- idade entre 18 e 120 anos
- CPF valido
- senha e confirmacao de senha

Antes do envio para a API, a data e convertida para `yyyy-mm-dd` e o CPF e normalizado para apenas digitos.

## Documentacao

- [Situacao atual do frontend](docs/front-status.md)
- [Identidade visual](docs/visual-identity.md)
- [Documentacao de contexto](docs/01-Documentação%20de%20Contexto.md)

## Pendencias principais

- Validar expiracao do token.
- Implementar refresh token automatico.
- Buscar dados do usuario autenticado.
- Melhorar tratamento de erros por campo vindos da API.
- Definir estrategia final de persistencia de sessao para producao.
- Adicionar testes para autenticacao e formularios.
- Implementar funcionalidades de favoritos/watchlist.
- Adicionar filtros avancados nas listagens de fundos.

## Funcionalidades Implementadas

### Visão Geral (`/home`)

A pagina de visao geral e o dashboard principal, organizado em secoes que facilitam a analise de fundos imobiliarios:

**Melhor Oportunidade:**
- Destaca o fundo com maior pontuacao geral considerando renda, preco e liquidez
- Exibe metricas principais com cores e icones diferenciados
- Mostra Renda Operacional (quando disponivel) e Retorno Anual dos imoveis
- Informacoes complementares: quantidade de imoveis, vacancia, preco/m², aluguel/m²
- Botao "Ver Detalhes" para acesso rapido a pagina completa do fundo

**Listagens de Fundos:**
- **Alto Rendimento:** Fundos ordenados por maior dividend yield
- **Fundos em Desconto:** Ordenados pelo menor P/VP (preco/valor patrimonial)
- **Mais Liquidos:** Maior volume financeiro negociado diariamente

Cada card de fundo exibe:
- Ticker e nome do fundo
- Segmento de atuacao
- Preco da cota
- Dividend Yield (renda)
- Renda Operacional (quando disponivel)
- Retorno Anual (quando disponivel)
- P/VP (preco/valor patrimonial)

Todos os cards sao clicaveis e direcionam para a pagina de detalhes do fundo.

### Detalhes do Fundo (`/home/fundo/:ticker`)

Pagina completa com todas as informacoes disponiveis sobre um fundo especifico:

**Cabecalho:**
- Preco atual da cota
- Variacao em diferentes periodos (dia, mes, 12 meses)
- Badges coloridos indicando alta/baixa

**Indicadores Principais:**
- Dividend Yield, P/VP, Liquidez diaria
- Valor patrimonial, Numero de cotistas
- Rentabilidade em varios periodos

**Resultados:**
- Ultimo rendimento mensal
- Rendimentos acumulados (3m, 6m, 12m)
- FFO (Funds From Operations)
- Vendas de ativos (quando aplicavel)

**Informacoes de Mercado:**
- Volume negociado
- Maxima e minima em 52 semanas
- Volatilidade

**Balanco Patrimonial:**
- Patrimonio liquido
- Valor patrimonial da cota
- Ativos, passivos e disponibilidades

**Propriedades:**
- Quantidade de imoveis
- Vacancia fisica e financeira
- Area total
- Percentual de patrimonio em imoveis
- Metricas por m²: preco, aluguel, Cap Rate

**Performance Anual:**
- Grafico de barras com rentabilidade ano a ano

### Comparador de Fundos (`/comparador`)

Ferramenta para comparacao lado a lado de ate 2 fundos:

**Recursos:**
- Busca de fundos com dropdown compacto
- Comparacao visual de todos os indicadores
- Destaques em verde/vermelho para melhor/pior em cada metrica
- Organizacao em secoes: Preco e Rentabilidade, Balanco, Propriedades
- Botao "Ver Detalhes" para cada fundo

**Experiencia do Usuario:**
- Interface limpa sem sobrecarga de informacao
- Dropdown com z-index otimizado para evitar sobreposicao
- Campos condicionais (aparecem apenas quando ha dados)

### Identidade Visual

A interface segue principios de design voltados para iniciantes:

- **Nomenclatura Simplificada:** Termos tecnicos sao apresentados de forma acessivel nas listas (ex: "Renda Op." ao inves de "FFO Yield"), mantendo precisao tecnica apenas nas paginas de detalhes
- **Cores Semanticas:** Verde para rendimentos, azul para valor patrimonial, roxo para renda operacional, ambar para retorno anual
- **Hierarquia Visual:** Informacoes principais em destaque, complementares em texto menor
- **Responsividade:** Layout adaptavel para desktop e mobile
- **Feedback Visual:** Hover states, badges de variacao, cores para alta/baixa
