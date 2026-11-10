import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Clock, Target, Flame, BookCheck, Award } from "lucide-react";

export const Route = createFileRoute("/app/stats")({
  head: () => ({
    meta: [
      { title: "Estatísticas — LexLearn" },
      {
        name: "description",
        content: "Acompanhe seu tempo de estudo, revisões e desempenho por tema no LexLearn.",
      },
      { property: "og:title", content: "Estatísticas — LexLearn" },
      {
        property: "og:description",
        content: "Acompanhe seu tempo de estudo, revisões e desempenho por tema no LexLearn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatsPage,
});

const weekly = [42, 68, 55, 90, 74, 58, 82];
const topics = [
  { name: "Direito Constitucional", pct: 88 },
  { name: "Administração Pública", pct: 74 },
  { name: "Ética", pct: 92 },
  { name: "ECA", pct: 41 },
  { name: "LDB", pct: 22 },
];

function StatsPage() {
  const max = Math.max(...weekly);
  const days = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <p className="text-xs uppercase tracking-widest text-primary/80">Analytics</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Estatísticas</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi icon={Flame} label="Streak" value="14 dias" delta="+2" />
        <Kpi icon={Clock} label="Tempo total" value="47h 30m" delta="+8h" />
        <Kpi icon={BookCheck} label="Cards revisados" value="1.284" delta="+112" />
        <Kpi icon={Award} label="Acerto médio" value="86%" delta="+4%" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-surface/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Tempo de estudo — última semana</h2>
              <p className="text-xs text-muted-foreground">Minutos por dia</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" /> +18%
            </span>
          </div>
          <div className="mt-8 flex h-56 items-end gap-3">
            {weekly.map((v, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/40 transition-all group-hover:from-primary group-hover:to-primary/70"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {v}m
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-surface/60 p-6">
          <h2 className="font-display text-lg font-semibold">Domínio por tópico</h2>
          <p className="text-xs text-muted-foreground">Acurácia média</p>
          <div className="mt-6 space-y-4">
            {topics.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="font-semibold text-foreground">{t.pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/40"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-surface/60 p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary shadow-[var(--shadow-glow)]">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold">Sua próxima meta</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete <span className="text-primary font-medium">3 sessões</span> em ECA para subir a acurácia acima de 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-2xl font-bold">{value}</p>
        <span className="text-xs text-emerald-400">{delta}</span>
      </div>
    </div>
  );
}
