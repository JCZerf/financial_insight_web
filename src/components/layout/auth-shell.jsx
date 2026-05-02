import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const highlights = [
  {
    title: 'JWT pronto para producao',
    description: 'Fluxo de login, refresh e sessao pensado para trabalhar bem com a API.',
  },
  {
    title: 'Cadastro com regras reais',
    description: 'Campos, validacoes e normalizacao seguem o contrato documentado do backend.',
  },
  {
    title: 'Base pronta para crescer',
    description: 'Separacao por paginas, features e componentes para evitar acoplamento cedo.',
  },
]

export function AuthShell({
  eyebrow,
  title,
  description,
  currentView,
  logoSrc,
  logoAlt = '',
  heroHighlights = highlights,
  children,
}) {
  return (
    <main className="grid min-h-screen bg-[radial-gradient(circle_at_top,rgba(0,137,123,0.09),transparent_30%),linear-gradient(180deg,#fafbfc_0%,#f7f8fa_100%)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0f1117_0%,#0d5f56_58%,#00897b_100%)] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-emerald-200/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            {logoSrc ? (
              <div className="inline-flex w-fit items-center rounded-[1.75rem] border border-white/12 bg-white/8 px-4 py-3 shadow-2xl shadow-black/10 backdrop-blur">
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="h-14 w-auto sm:h-16"
                />
              </div>
            ) : null}

            {eyebrow ? (
              <span className="inline-flex w-fit items-center rounded-full border border-white/18 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-white/90">
                {eyebrow}
              </span>
            ) : null}

            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl leading-none font-semibold text-balance sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {heroHighlights.map((item) => (
              <Card
                key={item.title}
                className="border-white/10 bg-white/8 text-white shadow-2xl shadow-black/10 backdrop-blur"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/10">
                      <ShieldCheck className="size-5" />
                    </span>
                    <CardTitle className="text-lg font-semibold text-white">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-white/80">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center gap-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                <BadgeCheck className="size-3.5" />
                Acesso seguro
              </span>
              <p className="text-sm text-muted-foreground">
                Analise de investimentos com uma interface mais clara e objetiva.
              </p>
            </div>

            <nav className="hidden items-center gap-2 rounded-full border border-border bg-white p-1 shadow-sm sm:flex">
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'login'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'register'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cadastro
              </Link>
            </nav>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}
