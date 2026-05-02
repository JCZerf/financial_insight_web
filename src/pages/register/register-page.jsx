import { Link } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import financialInsightLogo from '@/assets/financial_insight_logo.png'
import { RegisterForm } from '@/features/auth/components/register-form'

const registerHighlights = [
  {
    title: 'Onboarding direto ao ponto',
    description: 'Crie sua conta e entre em uma plataforma pensada para reduzir a complexidade da analise de investimentos.',
  },
  {
    title: 'Base para renda passiva',
    description: 'O foco inicial da Financial Insight e ajudar na leitura de oportunidades em FIIs com mais clareza.',
  },
  {
    title: 'Dados publicos, leitura acessivel',
    description: 'A proposta e transformar indicadores tecnicos em uma experiencia visual mais simples para o investidor.',
  },
]

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Primeiro acesso"
      title="Comece sua jornada com uma plataforma feita para investir com mais criterio."
      description="Crie sua conta para acompanhar oportunidades, comparar indicadores e ganhar tempo na selecao de ativos voltados a renda passiva."
      currentView="register"
      logoSrc={financialInsightLogo}
      logoAlt="Logo Financial Insight"
      heroHighlights={registerHighlights}
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
