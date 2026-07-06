import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Play,
  BrainCircuit,
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Sparkles,
  Check,
  GraduationCap,
  Code2,
  LineChart,
  Trophy,
} from "lucide-react";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";
import mobileMockup from "@/assets/mobile-mockup.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexlearn — Plataforma de Edutech com IA" },
      {
        name: "description",
        content:
          "Nexlearn é a plataforma edtech que acelera o aprendizado com IA, analytics em tempo real e experiências imersivas para escolas, empresas e criadores.",
      },
      { property: "og:title", content: "Nexlearn — Plataforma de Edutech com IA" },
      {
        property: "og:description",
        content:
          "Acelere o aprendizado com IA, analytics em tempo real e experiências imersivas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <LogoStrip />
      <Benefits />
      <DashboardShowcase />
      <FeatureGrid />
      <MobileShowcase />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary shadow-[var(--shadow-glow)]">
            <BrainCircuit className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">nexlearn</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#benefits" className="hover:text-foreground transition-colors">Benefícios</a>
          <a href="#platform" className="hover:text-foreground transition-colors">Plataforma</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Planos</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/app" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Entrar</a>
          <a
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.02]"
          >
            Abrir workspace <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-24">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute left-1/2 top-20 h-[500px] w-[900px] -translate-x-1/2 rounded-full blur-3xl animate-glow-pulse"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.22 25 / 0.35), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Novo · IA adaptativa para cada aluno
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            O futuro da <span className="text-gradient-red">educação</span>
            <br />
            começa aqui.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Nexlearn combina inteligência artificial, analytics em tempo real e experiências imersivas para transformar como pessoas aprendem — e como você ensina.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.03]"
            >
              Teste grátis por 14 dias
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#platform"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur hover:bg-surface-elevated"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Ver demonstração
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> Sem cartão de crédito</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> Setup em 5 minutos</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-primary" /> Cancele quando quiser</span>
          </div>
        </div>

        {/* Hero mockup */}
        <div className="relative mx-auto mt-20 max-w-6xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-60 blur-2xl" />
          <div className="relative overflow-hidden rounded-xl border border-border shadow-[var(--shadow-elevated)]">
            <img
              src={dashboardMockup}
              alt="Dashboard da plataforma Nexlearn mostrando progresso de cursos e analytics"
              width={1600}
              height={1008}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoStrip() {
  const logos = ["ACME EDU", "NOVATEC", "PRISMA", "CORTEX", "NEURON", "KAIROS", "VECTOR", "APEX"];
  return (
    <section className="border-y border-border/40 bg-surface/30 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Mais de 2.000 organizações confiam na Nexlearn
        </p>
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-16">
            {[...logos, ...logos].map((logo, i) => (
              <span
                key={i}
                className="font-display text-2xl font-bold tracking-tight text-muted-foreground/50 whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    {
      icon: Zap,
      title: "Aprendizado 3x mais rápido",
      desc: "IA adaptativa personaliza cada jornada, cortando o tempo de dominar um assunto pela metade.",
    },
    {
      icon: BarChart3,
      title: "Decisões guiadas por dados",
      desc: "Analytics em tempo real revelam engajamento, gaps de conhecimento e ROI de cada trilha.",
    },
    {
      icon: Users,
      title: "Escale sem perder qualidade",
      desc: "De 10 a 100.000 alunos. Infraestrutura pronta com automações que substituem horas de trabalho manual.",
    },
    {
      icon: ShieldCheck,
      title: "Segurança em nível corporativo",
      desc: "SOC 2, LGPD, SSO e criptografia end-to-end. Confie seus dados a uma plataforma auditada.",
    },
  ];
  return (
    <section id="benefits" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Benefícios</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Resultados que você <span className="text-gradient-red">sente</span> no primeiro mês
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma plataforma pensada para gerar impacto mensurável — não só engajamento vazio.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 p-6 transition-all hover:border-primary/50 hover:-translate-y-1"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardShowcase() {
  return (
    <section id="platform" className="relative py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Command center</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Um painel. <br />
              <span className="text-gradient-red">Controle total.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Acompanhe cada aluno, cada curso e cada métrica de negócio em uma interface unificada. Descubra tendências antes que virem problemas.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Métricas de progresso em tempo real por turma e por aluno",
                "Alertas inteligentes para alunos em risco de evasão",
                "Relatórios exportáveis prontos para diretoria",
                "Integração nativa com LMS, RH e CRM",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-2xl bg-primary/30 opacity-40 blur-3xl" />
            <div className="relative overflow-hidden rounded-xl border border-border shadow-[var(--shadow-elevated)] animate-float">
              <img
                src={dashboardMockup}
                alt="Dashboard analítico com métricas de aprendizado"
                width={1600}
                height={1008}
                loading="lazy"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: BrainCircuit,
      title: "IA que adapta cada trilha",
      desc: "Modelos que ajustam dificuldade, ritmo e conteúdo conforme o desempenho de cada aluno.",
    },
    {
      icon: Code2,
      title: "Editor de conteúdo sem código",
      desc: "Crie cursos, quizzes e simulações interativas com drag-and-drop.",
    },
    {
      icon: LineChart,
      title: "Analytics preditivos",
      desc: "Antecipe evasão e recomende intervenções antes que o problema aconteça.",
    },
    {
      icon: Trophy,
      title: "Gamificação nativa",
      desc: "XP, badges, ranks e desafios que aumentam retenção em até 68%.",
    },
    {
      icon: GraduationCap,
      title: "Certificação verificável",
      desc: "Certificados assinados digitalmente e verificáveis via blockchain.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance & privacidade",
      desc: "LGPD, GDPR, SOC 2 e SSO. Suas informações protegidas por padrão.",
    },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Plataforma</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tudo que você precisa <br />para <span className="text-gradient-red">ensinar em escala</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-background p-6 transition-all hover:border-primary/40"
            >
              <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileShowcase() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 rounded-2xl bg-primary/30 opacity-40 blur-3xl" />
            <img
              src={mobileMockup}
              alt="App mobile Nexlearn com cursos e player de vídeo"
              width={912}
              height={1200}
              loading="lazy"
              className="relative mx-auto w-full max-w-lg animate-float"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mobile-first</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Aprender em <span className="text-gradient-red">qualquer lugar</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              App nativo iOS e Android com aulas offline, notificações inteligentes e player otimizado. Retenção 4x maior comparado a plataformas web-only.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { k: "94%", v: "conclusão de cursos" },
                { k: "4.9★", v: "avaliação nas lojas" },
                { k: "68%", v: "menos evasão" },
                { k: "12min", v: "sessão média diária" },
              ].map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-surface/60 p-4">
                  <div className="font-display text-3xl font-bold text-gradient-red">{s.k}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { k: "2M+", v: "alunos ativos" },
    { k: "2.000+", v: "organizações" },
    { k: "180+", v: "países" },
    { k: "99.99%", v: "uptime SLA" },
  ];
  return (
    <section className="border-y border-border/40 bg-surface/30 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-4xl font-bold text-gradient-red md:text-5xl">{s.k}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 149",
      period: "/mês",
      desc: "Para criadores e times pequenos começando agora.",
      features: ["Até 100 alunos", "5 cursos", "Analytics básicos", "Suporte por email"],
      cta: "Começar grátis",
      highlight: false,
    },
    {
      name: "Business",
      price: "R$ 599",
      period: "/mês",
      desc: "Para empresas escalando programas de aprendizado.",
      features: [
        "Até 5.000 alunos",
        "Cursos ilimitados",
        "IA adaptativa completa",
        "Analytics preditivos",
        "Integrações & SSO",
        "Suporte prioritário",
      ],
      cta: "Iniciar teste",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Volume alto, requisitos avançados e suporte dedicado.",
      features: [
        "Alunos ilimitados",
        "SLA 99.99% garantido",
        "Customer Success dedicado",
        "White-label completo",
        "Compliance sob medida",
      ],
      cta: "Falar com vendas",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Planos</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Preços que <span className="text-gradient-red">escalam com você</span>
          </h2>
          <p className="mt-4 text-muted-foreground">14 dias grátis em todos os planos. Sem cartão de crédito.</p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-8 transition-all ${
                p.highlight
                  ? "border-primary/60 bg-gradient-to-b from-primary/10 to-surface shadow-[var(--shadow-red)]"
                  : "border-border bg-surface/60 hover:border-primary/30"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Mais popular
                </div>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <a
                href="#cta"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-[var(--shadow-red)]"
                    : "border border-border bg-surface hover:bg-surface-elevated"
                }`}
              >
                {p.cta}
              </a>
              <ul className="mt-8 space-y-3">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-surface via-background to-surface p-12 text-center md:p-16">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.62 0.22 25 / 0.4), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
              Pronto para <span className="text-gradient-red">reinventar</span> <br />
              como sua organização aprende?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Junte-se a milhares de empresas que já aceleraram o desenvolvimento de seus times com Nexlearn.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.03]"
              >
                Começar teste grátis <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-medium hover:bg-surface-elevated"
              >
                Agendar demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary">
            <BrainCircuit className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">nexlearn</span>
          <span className="ml-3 text-xs text-muted-foreground">© 2026 · Todos os direitos reservados</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacidade</a>
          <a href="#" className="hover:text-foreground">Termos</a>
          <a href="#" className="hover:text-foreground">Segurança</a>
          <a href="#" className="hover:text-foreground">Contato</a>
        </div>
      </div>
    </footer>
  );
}
