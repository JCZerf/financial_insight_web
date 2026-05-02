import { ArrowUpRight, BadgeCheck, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ThemeToggle } from '@/components/layout/theme-toggle'

const previewRows = [
  { label: 'Dividend yield', value: '8,74%', tone: 'text-financial-positive' },
  { label: 'P/VP medio', value: '0,91', tone: 'text-white' },
  { label: 'Liquidez diaria', value: 'R$ 1,8 mi', tone: 'text-white' },
]

export function AuthShell({
  eyebrow,
  title,
  description,
  currentView,
  logoSrc,
  logoAlt = '',
  children,
}) {
  return (
    <main className="grid min-h-screen overflow-x-hidden bg-background lg:h-screen lg:min-h-0 lg:overflow-hidden lg:grid-cols-[minmax(24rem,0.82fr)_minmax(34rem,1.18fr)]">
      <section className="relative max-w-full overflow-hidden bg-[#0f1117] px-6 py-8 text-white sm:px-10 lg:px-12 xl:px-14">
        <div className="absolute inset-y-0 right-0 w-px bg-white/10" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(0,137,123,0.18)_0%,transparent_46%),linear-gradient(0deg,rgba(0,137,123,0.22),transparent_34%)]" />

        <div className="relative mx-auto flex h-full w-[calc(100vw-3rem)] max-w-[31rem] flex-col justify-center gap-10 sm:w-full">
          <div className="flex items-center gap-4">
            {logoSrc ? (
              <div className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  className="h-auto w-full"
                />
              </div>
            ) : null}

            <div>
              <p className="text-base font-semibold leading-5">Financial Insight</p>
              <p className="text-sm leading-6 text-white/58">
                Analise de FIIs e renda passiva
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full border border-white/12 bg-white/7 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-white/72">
                  {eyebrow}
                </span>
              ) : null}

              <h1 className="max-w-[19rem] text-[1.95rem] leading-tight font-semibold text-balance sm:max-w-[28rem] sm:text-4xl lg:text-[2.8rem]">
                {title}
              </h1>
              <p className="max-w-full text-base leading-7 text-white/68 sm:max-w-[27rem]">
                {description}
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:block">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/22 text-primary">
                    <BarChart3 className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Resumo de leitura</p>
                    <p className="text-xs leading-5 text-white/54">Base de indicadores</p>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-white/45" />
              </div>

              <div className="divide-y divide-white/8 rounded-xl border border-white/8 bg-[#101820]/78">
                {previewRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-white/62">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.tone}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-full px-6 py-8 sm:px-10 lg:px-12 xl:px-16">
        <div className="mx-auto flex min-h-full w-[calc(100vw-3rem)] min-w-0 max-w-[36rem] flex-col justify-center gap-7 sm:w-full">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold tracking-[0.22em] uppercase text-primary">
                <BadgeCheck className="size-3.5" />
                Acesso seguro
              </span>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                Entre para acompanhar seus filtros e oportunidades em um so lugar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <nav className="flex w-fit items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-[0_12px_30px_rgba(15,17,23,0.06)]">
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'login'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentView === 'register'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cadastro
              </Link>
              </nav>

              <div className="w-fit rounded-full border border-border bg-card p-1.5 shadow-[0_12px_30px_rgba(15,17,23,0.06)]">
                <ThemeToggle isCollapsed />
              </div>
            </div>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}
