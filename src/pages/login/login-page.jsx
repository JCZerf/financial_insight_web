import { Link, useLocation } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import financialInsightLogo from '@/assets/financial_insight_logo_with_name.png'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  const location = useLocation()
  const registeredEmail = location.state?.registeredEmail ?? ''

  return (
    <AuthShell
      eyebrow=""
      title="Acesse sua area de analise."
      description="Consulte indicadores, filtros e oportunidades acompanhadas em uma interface feita para leitura objetiva."
      currentView="login"
      logoSrc={financialInsightLogo}
      logoAlt="Logo Financial Insight"
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
