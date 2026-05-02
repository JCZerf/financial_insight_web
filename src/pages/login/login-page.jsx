import { Link, useLocation } from 'react-router-dom'

import { AuthShell } from '@/components/layout/auth-shell'
import financialInsightLogo from '@/assets/financial_insight_logo.png'
import { LoginForm } from '@/features/auth/components/login-form'

const loginHighlights = [
  {
    title: 'Radar de oportunidades',
    description: 'A plataforma cruza indicadores como P/VP, dividend yield e liquidez para facilitar a triagem dos melhores ativos.',
  },
  {
    title: 'Menos planilha, mais decisao',
    description: 'O Financial Insight automatiza o trabalho pesado da coleta e organizacao de dados publicos do mercado.',
  },
  {
    title: 'Feito para o investidor de varejo',
    description: 'A proposta e reduzir a barreira tecnica e ampliar o acesso a analise de investimentos com mais clareza visual.',
  },
]

export function LoginPage() {
  const location = useLocation()
  const registeredEmail = location.state?.registeredEmail ?? ''

  return (
    <AuthShell
      eyebrow=""
      title="Seu radar visual para encontrar oportunidades e construir renda passiva."
      description="A Financial Insight transforma dados publicos do mercado em uma leitura simples, visual e orientada a decisao para quem quer investir com mais criterio e menos friccao."
      currentView="login"
      logoSrc={financialInsightLogo}
      logoAlt="Logo Financial Insight"
      heroHighlights={loginHighlights}
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
