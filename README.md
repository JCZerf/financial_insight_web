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
| `/home` | Dashboard provisório autenticado. |

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

- Implementar o dashboard real.
- Validar expiracao do token.
- Implementar refresh token automatico.
- Buscar dados do usuario autenticado.
- Melhorar tratamento de erros por campo vindos da API.
- Definir estrategia final de persistencia de sessao para producao.
- Adicionar testes para autenticacao e formularios.
