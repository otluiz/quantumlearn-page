import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Play, Clock, Trophy, Flame, Target } from "lucide-react";

export const Route = createFileRoute("/app/study")({
  head: () => ({
    meta: [
      { title: "Estudar — LexLearn" },
      {
        name: "description",
        content: "Retome suas trilhas e organize suas sessões de preparação para concursos.",
      },
      { property: "og:title", content: "Estudar — LexLearn" },
      {
        property: "og:description",
        content: "Retome suas trilhas e organize suas sessões de preparação para concursos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyPage,
});

const trilhas = [
  { title: "Direito Constitucional", progress: 68, time: "3h 20min", modules: 12, color: "from-primary to-primary/40" },
  { title: "Ética no Serviço Público", progress: 100, time: "1h 40min", modules: 6, color: "from-emerald-500 to-emerald-500/40" },
  { title: "Estatuto do Servidor", progress: 34, time: "5h 10min", modules: 18, color: "from-primary to-primary/40" },
  { title: "LDB — Lei de Diretrizes", progress: 12, time: "8h 00min", modules: 24, color: "from-amber-500 to-amber-500/40" },
];

function StudyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <p className="text-xs uppercase tracking-widest text-primary/80">Aprender</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Estudar</h1>
      <p className="mt-2 text-sm text-muted-foreground">Retome uma trilha ou comece uma nova sessão focada.</p>

      {/* Streak row */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniStat icon={Flame} label="Streak" value="14 dias" />
        <MiniStat icon={Clock} label="Esta semana" value="8h 42min" />
        <MiniStat icon={Target} label="Meta diária" value="82%" />
        <MiniStat icon={Trophy} label="XP" value="12.480" />
      </div>

      {/* Trilhas */}
      <h2 className="mt-10 font-display text-xl font-semibold">Trilhas ativas</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {trilhas.map((t) => (
          <div
            key={t.title}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-surface/60 p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-red)]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
            <div className="relative flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary shadow-[var(--shadow-glow)]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xs text-muted-foreground">{t.modules} módulos · {t.time}</span>
            </div>

            <h3 className="relative mt-4 font-display text-lg font-semibold">{t.title}</h3>

            <div className="relative mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span className="font-medium text-foreground">{t.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.progress}%` }} />
              </div>
            </div>

            <button className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.01]">
              <Play className="h-3.5 w-3.5 fill-current" /> Continuar trilha
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/60 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
