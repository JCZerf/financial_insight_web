# Situacao Atual do Frontend

## Visao geral

O frontend da Financial Insight possui fluxo autenticado funcional, telas de leitura dos FIIs e uma area de analise com filtros personalizados. A experiencia esta organizada para separar a visao executiva do mercado da triagem operacional de fundos.

A aplicacao usa React, Vite, Tailwind CSS e componentes baseados em `shadcn/ui`. A identidade visual esta documentada em `docs/visual-identity.md`.

O tema visual possui suporte a modo claro e escuro. A preferencia e armazenada no `localStorage` e aplicada pela classe `dark` no elemento raiz do documento.

## Rotas

| Rota | Tela | Estado |
|---|---|---|
| `/` | Redirecionamento | Envia para `/home` se houver token salvo; caso contrario, envia para `/login`. |
| `/login` | Login | Funcional com validacao local, chamada JWT e redirecionamento pos-login. |
| `/cadastro` | Cadastro | Funcional com validacoes locais e envio para a API. |
| `/home` | Visao Geral | Resumo executivo dos principais FIIs com maior potencial, melhor oportunidade, cards de sintese e listas de leitura rapida. |
| `/analise` | Analise de Fundos | Tela de triagem com filtros personalizados por segmento, rendimento minimo, preco/patrimonio maximo, liquidez minima e limite de itens. |
| `/home/fundo/:ticker` | Detalhe do Fundo | Exibe cotacao, leitura inicial, indicadores, mercado/liquidez, patrimonio, resultados financeiros e dados de imoveis. |
| `/perfil` | Perfil | Permite consultar e atualizar dados do usuario autenticado. |
| `*` | Fallback | Redireciona para `/login`. |

## Autenticacao

O login chama o endpoint:

```text
/api/auth/jwt/create/
```

Em desenvolvimento, essa URL e encaminhada pelo proxy do Vite para o backend configurado em `VITE_API_URL`.

Ao autenticar com sucesso:

- `access_token` e salvo no `localStorage`.
- `refresh_token` e salvo no `localStorage`.
- O usuario e redirecionado para `/home`.

A protecao de rota verifica a existencia de tokens armazenados antes de permitir acesso as rotas autenticadas. As chamadas autenticadas usam o `access_token` e, em caso de resposta 401, tentam renovar a sessao com o `refresh_token`. Se a renovacao falhar, os tokens sao removidos e o usuario e redirecionado para `/login`.

## Proxy de desenvolvimento

O proxy foi adicionado em `vite.config.js` para evitar problemas de CORS durante o desenvolvimento.

Configuracao atual:

```text
/api -> VITE_API_URL
```

Com `.env` atual:

```text
VITE_API_URL=http://127.0.0.1:8000
```

No ambiente de desenvolvimento, o frontend usa base vazia (`''`) para as chamadas HTTP. Assim, o navegador chama `/api/...` na mesma origem do Vite, e o Vite encaminha para o backend.

Em producao, `VITE_API_URL` volta a ser usado diretamente.

## Validacoes

### Login

Validacoes locais:

- email obrigatorio
- email em formato valido
- senha obrigatoria

Mensagens tecnicas da API ou do navegador nao devem aparecer para o usuario. O front traduz erros conhecidos para mensagens amigaveis.

Exemplos:

- Credenciais invalidas: `Email ou senha incorretos. Confira os dados e tente novamente.`
- Falha de conexao: `Nao foi possivel conectar ao servidor. Tente novamente em instantes.`

### Cadastro

Validacoes locais:

- email obrigatorio e valido
- nome completo com minimo de letras
- data de nascimento obrigatoria e valida
- idade entre 18 e 120 anos
- CPF valido
- senha obrigatoria
- confirmacao de senha igual a senha

A data de nascimento usa mascara brasileira:

```text
dd/mm/aaaa
```

Antes de enviar para a API, o valor e convertido para:

```text
yyyy-mm-dd
```

O CPF tambem e mascarado na UI e normalizado antes do envio.

## UX atual

As telas de login e cadastro usam `AuthShell`, com:

- painel lateral de marca
- resumo visual de indicadores
- formulario centralizado
- seletor Login/Cadastro
- alertas amigaveis para erro e sucesso

O seletor nativo de data foi removido para evitar o padrao americano e a interface inconsistente do navegador.

Na area autenticada, a navegacao principal usa menu lateral com:

- link para Visao Geral;
- link para Analise;
- link para Perfil;
- acao de sair da conta;
- modo recolhido em desktop;
- comportamento compacto em telas menores.

As telas autenticadas usam um cabecalho comum com:

- identificacao do usuario logado por nome e email;
- alternancia entre tema claro e escuro;
- titulo e descricao contextual da tela.

As telas de login e cadastro tambem disponibilizam alternancia de tema no topo do formulario.

A Visao Geral tem foco em leitura rapida dos FIIs com maior potencial, evitando concentrar funcionalidades operacionais na mesma tela. A tela de Analise concentra os filtros personalizados e retorna apenas os fundos compativeis com os criterios informados. Quando nao ha resultados, a interface exibe estado vazio com mensagem orientativa.

## Pontos pendentes

- Definir estrategia de logout global compartilhada entre as telas autenticadas.
- Melhorar tratamento de erros por campo no cadastro quando a API retornar respostas especificas.
- Revisar persistencia de token antes de producao, especialmente riscos de `localStorage`.
- Adicionar testes de fluxo das telas de Visao Geral, Analise e Detalhe do Fundo.
- Adicionar testes de fluxo de autenticacao e validacao de formularios.
- Implementar monitoramento de ativos, precos-alvo e alertas quando existirem endpoints e modelos no backend.

## Comandos de verificacao

```bash
npm run lint
npm run build
```

Para desenvolvimento:

```bash
npm run dev
```
