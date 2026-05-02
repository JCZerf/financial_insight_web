# Situacao Atual do Frontend

## Visao geral

O frontend da Financial Insight esta em uma fase inicial funcional, com fluxo de autenticacao, cadastro e uma area autenticada provisoria.

A aplicacao usa React, Vite, Tailwind CSS e componentes baseados em `shadcn/ui`. A identidade visual esta documentada em `docs/visual-identity.md`.

## Rotas

| Rota | Tela | Estado |
|---|---|---|
| `/` | Redirecionamento | Envia para `/home` se houver token salvo; caso contrario, envia para `/login`. |
| `/login` | Login | Funcional com validacao local, chamada JWT e redirecionamento pos-login. |
| `/cadastro` | Cadastro | Funcional com validacoes locais e envio para a API. |
| `/home` | Dashboard inicial | Placeholder autenticado para confirmar login bem-sucedido. |
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

A protecao atual de rota e simples: a rota `/home` verifica apenas se existe `access_token` no `localStorage`. Ainda nao existe validacao de expiracao, refresh automatico ou consulta obrigatoria ao usuario autenticado.

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

## Pontos pendentes

- Implementar dashboard real em `/home`.
- Validar token expirado e remover sessao invalida.
- Implementar refresh token automatico.
- Buscar dados do usuario autenticado em `/api/auth/users/me/`.
- Melhorar tratamento de erros por campo no cadastro quando a API retornar respostas especificas.
- Definir estrategia de logout global.
- Revisar persistencia de token antes de producao, especialmente riscos de `localStorage`.
- Adicionar testes de fluxo de autenticacao e validacao de formularios.

## Comandos de verificacao

```bash
npm run lint
npm run build
```

Para desenvolvimento:

```bash
npm run dev
```
