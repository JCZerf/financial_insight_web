import { useState } from 'react'
import { Fingerprint, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
  loginWithJwt,
  persistAuthTokens,
} from '@/features/auth/lib/auth-client'
import { validateLoginForm } from '@/features/auth/lib/auth-validators'

import { FeedbackAlert } from './feedback-alert'

const validationMessages = new Set([
  'Informe seu email.',
  'Informe um email valido.',
  'Informe sua senha.',
])

export function LoginForm({ defaultEmail = '' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: defaultEmail,
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const isFieldError = validationMessages.has(error)

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

    const validationError = validateLoginForm(form)

    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const tokens = await loginWithJwt({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      persistAuthTokens(tokens)
      setSuccess('Login realizado com sucesso. Tokens persistidos localmente.')
      navigate('/home', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full min-w-0 max-w-full rounded-[2rem] border-border bg-card shadow-[0_28px_70px_rgba(15,17,23,0.08)]">
      <CardHeader className="space-y-3 px-6 pt-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-primary">
          <Fingerprint className="size-3.5" />
          Login
        </span>
        <CardTitle className="text-3xl font-semibold text-foreground">
          Entrar na plataforma
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          Acesse sua conta para acompanhar filtros, insights e oportunidades
          analisadas a partir de dados publicos do mercado.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
              className="h-12 rounded-2xl border-border bg-background"
              aria-invalid={isFieldError}
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
              className="h-12 rounded-2xl border-border bg-background"
              aria-invalid={isFieldError}
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
            className="h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/90"
            disabled={isSubmitting}
          >
            <KeyRound className="size-4" />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
