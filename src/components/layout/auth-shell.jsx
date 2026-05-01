import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react'
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
  children,
}) {
  return (
    <main className="grid min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-[linear-gradient(145deg,#0f172a_0%,#0f766e_45%,#ea580c_100%)] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-orange-200/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-white/90">
              {eyebrow}
            </span>

            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl leading-none font-semibold text-balance sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-100/78 sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item) => (
              <Card
                key={item.title}
                className="border-white/12 bg-white/10 text-white shadow-2xl shadow-slate-950/10 backdrop-blur"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/12">
                      <ShieldCheck className="size-5" />
                    </span>
                    <CardTitle className="text-lg font-semibold text-white">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-100/80">
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
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                <BadgeCheck className="size-3.5" />
                Acesso seguro
              </span>
              <p className="text-sm text-muted-foreground">
                Estrutura pronta para crescer sem virar um arquivo gigante.
              </p>
            </div>

            <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-white/80 p-1 shadow-sm backdrop-blur sm:flex">
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'login'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'register'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cadastro
              </Link>
            </nav>
          </div>

          {children}

          <div className="flex items-center justify-between gap-3 rounded-3xl border border-border/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-sm font-medium text-foreground">
                API de autenticacao documentada
              </p>
              <p className="text-sm text-muted-foreground">
                Login com JWT, refresh rotativo e consulta de `/users/me/`.
              </p>
            </div>
            <ArrowRight className="hidden size-5 text-muted-foreground sm:block" />
          </div>
        </div>
      </section>
    </main>
  )
}
