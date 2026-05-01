import { useState } from 'react'
import { Fingerprint, KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  fetchAuthenticatedUser,
  getApiBaseUrl,
  loginWithJwt,
  persistAuthTokens,
} from '@/features/auth/lib/auth-client'

import { FeedbackAlert } from './feedback-alert'

export function LoginForm({ defaultEmail = '' }) {
  const [form, setForm] = useState({
    email: defaultEmail,
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sessionUser, setSessionUser] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const tokens = await loginWithJwt({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      persistAuthTokens(tokens)

      const user = await fetchAuthenticatedUser(tokens.access)

      setSessionUser(user)
      setSuccess('Login realizado com sucesso. Tokens persistidos localmente.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-[2rem] border-border/70 bg-white/88 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <CardHeader className="space-y-3 px-6 pt-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-primary">
          <Fingerprint className="size-3.5" />
          Login
        </span>
        <CardTitle className="text-3xl font-semibold text-foreground">
          Entrar na plataforma
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          Use seu email e senha para receber `access` e `refresh`, depois validar
          a sessao com `/users/me/`.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@empresa.com"
              autoComplete="email"
              className="h-12 rounded-2xl bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Sua senha"
              autoComplete="current-password"
              className="h-12 rounded-2xl bg-white"
              required
            />
          </div>

          {error ? (
            <FeedbackAlert
              variant="destructive"
              title="Nao foi possivel autenticar"
              description={error}
            />
          ) : null}

          {success ? (
            <FeedbackAlert
              title="Sessao iniciada"
              description={success}
            />
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#ea580c_100%)] text-base font-semibold text-white shadow-lg shadow-orange-500/10 hover:opacity-95"
            disabled={isSubmitting}
          >
            <KeyRound className="size-4" />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="grid gap-3 rounded-3xl bg-slate-950 px-5 py-4 text-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                API base
              </p>
              <p className="mt-1 text-sm text-slate-200">{getApiBaseUrl()}</p>
            </div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
              `access_token` + `refresh_token`
            </div>
          </div>

          {sessionUser ? (
            <div className="grid gap-1 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm">
              <span className="font-medium text-white">{sessionUser.name}</span>
              <span className="text-slate-300">{sessionUser.email}</span>
              <span className="text-slate-400">
                Autorizado: {sessionUser.is_authorized ? 'sim' : 'nao'}
              </span>
            </div>
          ) : (
            <p className="text-sm leading-6 text-slate-400">
              Depois do login, os dados de `/api/auth/users/me/` aparecem aqui.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
