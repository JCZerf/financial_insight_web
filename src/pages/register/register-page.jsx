import { Link } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import financialInsightLogo from '@/assets/financial_insight_logo_with_name.png'
import { RegisterForm } from '@/features/auth/components/register-form'

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Primeiro acesso"
      title="Crie seu acesso ao painel."
      description="Informe seus dados para entrar na plataforma e organizar sua leitura de indicadores do mercado."
      currentView="register"
      logoSrc={financialInsightLogo}
      logoAlt="Logo Financial Insight"
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
