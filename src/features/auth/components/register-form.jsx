import { useState } from 'react'
import { CalendarRange, ShieldPlus } from 'lucide-react'
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
import { registerUser } from '@/features/auth/lib/auth-client'
import {
  formatCpf,
  normalizeCpf,
  validateRegisterForm,
} from '@/features/auth/lib/auth-validators'

import { FeedbackAlert } from './feedback-alert'

const initialForm = {
  name: '',
  email: '',
  birthDate: '',
  cpf: '',
  password: '',
  confirmPassword: '',
}

export function RegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: name === 'cpf' ? formatCpf(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const validationError = validateRegisterForm(form)

    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const payload = await registerUser({
        email: form.email.trim().toLowerCase(),
        name: form.name.trim().replace(/\s+/g, ' '),
        birth_date: form.birthDate,
        cpf: normalizeCpf(form.cpf),
        password: form.password,
        re_password: form.confirmPassword,
      })

      setSuccess(`Cadastro concluido para ${payload.name}.`)
      setForm(initialForm)

      window.setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { registeredEmail: payload.email },
        })
      }, 900)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-[2rem] border-border/70 bg-white/88 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <CardHeader className="space-y-3 px-6 pt-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-orange-700">
          <ShieldPlus className="size-3.5" />
          Cadastro
        </span>
        <CardTitle className="text-3xl font-semibold text-foreground">
          Criar uma nova conta
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          O formulario segue as regras do backend para email, CPF, idade minima
          e confirmacao de senha.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="register-name">Nome completo</Label>
              <Input
                id="register-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ana Silva"
                autoComplete="name"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ana@empresa.com"
                autoComplete="email"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-birthDate">Data de nascimento</Label>
              <Input
                id="register-birthDate"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                autoComplete="bday"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-cpf">CPF</Label>
              <Input
                id="register-cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                inputMode="numeric"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Senha</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Crie uma senha forte"
                autoComplete="new-password"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirmPassword">Confirmar senha</Label>
              <Input
                id="register-confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                autoComplete="new-password"
                className="h-12 rounded-2xl bg-white"
                required
              />
            </div>
          </div>

          {error ? (
            <FeedbackAlert
              variant="destructive"
              title="Nao foi possivel cadastrar"
              description={error}
            />
          ) : null}

          {success ? (
            <FeedbackAlert
              title="Conta criada"
              description={`${success} Redirecionando para login...`}
            />
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_55%,#ea580c_100%)] text-base font-semibold text-white shadow-lg shadow-slate-900/10 hover:opacity-95"
            disabled={isSubmitting}
          >
            <CalendarRange className="size-4" />
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <div className="rounded-3xl border border-dashed border-border/80 bg-muted/60 px-5 py-4 text-sm leading-6 text-muted-foreground">
          O frontend ja normaliza email e CPF antes do envio. Se quiser, no
          proximo passo eu tambem posso encaixar refresh automatico e guard de
          rotas autenticadas.
        </div>
      </CardContent>
    </Card>
  )
}
