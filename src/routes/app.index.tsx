import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  CheckCircle2,
  BookOpen,
  Upload,
  Zap,
  FileQuestion,
  Layers,
  MessageSquare,
  Cog,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [{ title: "Dashboard — Nexlearn" }],
  }),
  component: Dashboard,
});

type DocStatus = "uploaded" | "processing" | "processed";

interface Doc {
  id: string;
  name: string;
  size: string;
  date: string;
  status: DocStatus;
}

const initialDocs: Doc[] = [
  { id: "1", name: "Direito_Constitucional.pdf", size: "3.1 MB", date: "2026-01-04", status: "processed" },
  { id: "2", name: "D1171.pdf", size: "0.08 MB", date: "2026-01-23", status: "processed" },
  { id: "3", name: "L9394_LDB.pdf", size: "1.4 MB", date: "2026-02-11", status: "processing" },
  { id: "4", name: "L8112_ServPubFed.pdf", size: "2.7 MB", date: "2026-02-14", status: "uploaded" },
  { id: "5", name: "L8069_ECA.pdf", size: "0.9 MB", date: "2026-02-18", status: "uploaded" },
  { id: "6", name: "L11892_ETPF.pdf", size: "1.1 MB", date: "2026-02-20", status: "processed" },
  { id: "7", name: "D54142_PE.pdf", size: "0.5 MB", date: "2026-02-22", status: "uploaded" },
  { id: "8", name: "lei_8429_improbidade.pdf", size: "1.8 MB", date: "2026-02-25", status: "uploaded" },
];

function Dashboard() {
  const [docs, setDocs] = useState(initialDocs);
  const [dragActive, setDragActive] = useState(false);

  const raw = docs.filter((d) => d.status === "uploaded").length;
  const processed = docs.filter((d) => d.status === "processed").length;
  const quizzes = processed * 3;

  const process = useCallback((id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "processing" } : d)));
    setTimeout(() => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, status: "processed" } : d)));
    }, 2200);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary/80">Painel de controle</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight lg:text-4xl">
            Bem-vindo de volta, <span className="text-gradient-red">Aluno</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue seus estudos ou processe um novo documento com IA.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          +24% de retenção esta semana
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="PDFs Brutos" value={raw} accent="muted" />
        <StatCard icon={CheckCircle2} label="Processados" value={processed} accent="primary" />
        <StatCard icon={BookOpen} label="Quizzes Gerados" value={quizzes} accent="muted" />
      </div>

      {/* Upload */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        className={`mt-6 relative overflow-hidden rounded-2xl border-2 border-dashed p-10 transition-all ${
          dragActive
            ? "border-primary bg-primary/5 shadow-[var(--shadow-red)]"
            : "border-border/60 bg-surface/40 hover:border-primary/40"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary shadow-[var(--shadow-glow)]">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Processar novo documento</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Arraste seu PDF aqui ou clique para selecionar. A IA cuida do resto.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.02]">
            <Upload className="h-4 w-4" />
            Selecionar PDF
          </button>
        </div>
      </div>

      {/* Recent docs */}
      <div className="mt-10 flex items-end justify-between">
        <h2 className="font-display text-xl font-semibold">Documentos recentes</h2>
        <Link
          to="/app/documents"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          Ver todos <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {docs.map((doc) => (
          <DocCard key={doc.id} doc={doc} onProcess={() => process(doc.id)} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: "primary" | "muted";
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-surface/60 p-5 transition-all hover:border-primary/40 hover:bg-surface">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className={`grid h-11 w-11 place-items-center rounded-lg ${
            accent === "primary"
              ? "bg-primary/15 text-primary shadow-[var(--shadow-glow)]"
              : "bg-white/5 text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc, onProcess }: { doc: Doc; onProcess: () => void }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-surface/60 p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-red)]">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
          <FileText className="h-5 w-5" />
        </div>
        <StatusPill status={doc.status} />
      </div>

      <h3 className="mt-4 truncate text-sm font-semibold text-foreground" title={doc.name}>
        {doc.name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {doc.size} · {doc.date}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {doc.status === "processed" ? (
          <>
            <ActionBtn icon={FileQuestion} label="Quiz" />
            <ActionBtn icon={Layers} label="Cards" />
            <ActionBtn icon={MessageSquare} label="Chat" href="/app/chat" />
          </>
        ) : doc.status === "processing" ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs text-primary">
            <Cog className="h-3 w-3 animate-spin" /> processando…
          </span>
        ) : (
          <button
            onClick={onProcess}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary"
          >
            <Zap className="h-3 w-3" /> Processar
          </button>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
}) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-white/5 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary";
  if (href) {
    return (
      <Link to={href} className={cls}>
        <Icon className="h-3 w-3" /> {label}
      </Link>
    );
  }
  return (
    <button className={cls}>
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

function StatusPill({ status }: { status: DocStatus }) {
  const map = {
    uploaded: { text: "uploaded", cls: "border-border/60 bg-white/5 text-muted-foreground" },
    processing: { text: "processando", cls: "border-primary/30 bg-primary/10 text-primary" },
    processed: { text: "processed", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${s.cls}`}>
      {s.text}
    </span>
  );
}
