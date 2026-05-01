import { Link } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import { RegisterForm } from '@/features/auth/components/register-form'

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Onboarding"
      title="Abra sua conta sem empilhar tudo dentro do App."
      description="O cadastro foi separado em pagina e feature proprias, com Tailwind e componentes reutilizaveis para o frontend continuar saudavel conforme o produto cresce."
      currentView="register"
    >
      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Ja possui acesso?{' '}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" to="/login">
          Voltar para login
        </Link>
      </p>
    </AuthShell>
  )
}
