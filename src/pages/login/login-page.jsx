import { Link, useLocation } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  const location = useLocation()
  const registeredEmail = location.state?.registeredEmail ?? ''

  return (
    <AuthShell
      eyebrow="Financial Insight"
      title="Entre com clareza e uma base que aguenta crescer."
      description="A tela de login agora vive em sua propria pasta, usa componentes prontos e deixa o projeto bem mais preparado para a expansao das proximas features."
      currentView="login"
    >
      <LoginForm defaultEmail={registeredEmail} />

      <p className="text-center text-sm text-muted-foreground">
        Ainda nao tem conta?{' '}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" to="/cadastro">
          Criar cadastro
        </Link>
      </p>
    </AuthShell>
  )
}
