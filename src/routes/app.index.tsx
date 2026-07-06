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
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  api,
  formatBytes,
  formatDate,
  isDocProcessing,
  isDocReady,
  type LexDocument,
  API_BASE,
} from "@/lib/api";
import { useDocuments, useReprocessDocument, documentsKey } from "@/hooks/use-documents";
import { UploadProgress, deriveStage } from "@/components/upload-progress";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — Nexlearn" }] }),
  component: Dashboard,
});

interface PendingUpload {
  id: string; // temp id local
  filename: string;
  size: number;
  phase: "uploading" | "validating" | "sent" | "failed";
  percent: number;
  docId?: string | number;
  error?: string;
  finishedAt?: number;
}

function Dashboard() {
  const qc = useQueryClient();
  const { data: docs, isLoading, isError, error, refetch } = useDocuments();
  const reprocess = useReprocessDocument();

  const [dragActive, setDragActive] = useState(false);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const list = docs ?? [];
  const raw = list.filter((d) => d.status === "uploaded" && !isDocProcessing(d)).length;
  const processed = list.filter(isDocReady).length;
  const processing = list.filter(isDocProcessing).length;

  // IDs de docs já rastreados por uploads locais -> não duplicar cards de progresso.
  const trackedDocIds = useMemo(
    () => new Set(pending.map((p) => p.docId).filter(Boolean) as (string | number)[]),
    [pending],
  );

  // Docs vindos do backend que ainda não estão prontos (e não estão sendo rastreados por upload local)
  const backendInProgress = list.filter(
    (d) => !isDocReady(d) && !trackedDocIds.has(d.id),
  );

  const updatePending = useCallback((id: string, patch: Partial<PendingUpload>) => {
    setPending((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const startUpload = useCallback(
    async (file: File) => {
      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setPending((p) => [
        ...p,
        {
          id: tempId,
          filename: file.name,
          size: file.size,
          phase: "uploading",
          percent: 0,
        },
      ]);

      try {
        const doc = await api.uploadWithProgress(file, (percent) =>
          updatePending(tempId, { percent }),
        );
        // Grace period "validation" para transição visível antes do worker pegar
        updatePending(tempId, { phase: "validating", percent: 100, docId: doc.id });
        qc.invalidateQueries({ queryKey: documentsKey });
        setTimeout(() => {
          updatePending(tempId, { phase: "sent" });
        }, 700);
      } catch (e) {
        updatePending(tempId, {
          phase: "failed",
          error: (e as Error).message,
          finishedAt: Date.now(),
        });
      }
    },
    [qc, updatePending],
  );

  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files) return;
      const arr = Array.from(files).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
      );
      arr.forEach(startUpload);
    },
    [startUpload],
  );

  const dismissPending = (id: string) =>
    setPending((p) => p.filter((x) => x.id !== id));

  const uploadingCount = pending.filter((p) => p.phase === "uploading" || p.phase === "validating" || p.phase === "sent").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary/80">Painel de controle</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight lg:text-4xl">
            Bem-vindo de volta, <span className="text-gradient-red">Aluno</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Envie um PDF para começar seus estudos.
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="PDFs Brutos" value={raw} accent="muted" />
        <StatCard icon={CheckCircle2} label="Processados" value={processed} accent="primary" />
        <StatCard icon={Cog} label="Em processamento" value={processing} accent="muted" />
      </div>

      {/* Upload dropzone */}
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
          handleFiles(e.dataTransfer.files);
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
            {uploadingCount > 0 ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">Processar novo documento</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Arraste seu PDF aqui ou clique para selecionar. POST <code className="text-primary/80">/api/upload</code> → RabbitMQ → Worker.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-[1.02]"
          >
            <Upload className="h-4 w-4" />
            Selecionar PDF
          </button>
        </div>
      </div>

      {/* Painel de progresso — uploads locais + docs em processamento no backend */}
      {(pending.length > 0 || backendInProgress.length > 0) && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Pipeline de ingestão</h2>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground/70">
              atualização em tempo real
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pending.map((p) => {
              const doc = p.docId ? list.find((d) => d.id === p.docId) : undefined;
              const stage =
                p.phase === "failed"
                  ? "storage"
                  : p.phase === "uploading"
                    ? "receiving"
                    : doc
                      ? deriveStage({ doc })
                      : deriveStage({ localPhase: p.phase });
              return (
                <UploadProgress
                  key={p.id}
                  filename={p.filename}
                  stage={stage}
                  uploadPercent={p.phase === "uploading" ? p.percent : undefined}
                  failed={p.phase === "failed"}
                  errorMessage={p.error}
                  onDismiss={() => dismissPending(p.id)}
                />
              );
            })}

            {backendInProgress.map((d) => (
              <UploadProgress
                key={`doc-${d.id}`}
                filename={d.filename_original}
                stage={deriveStage({ doc: d })}
                failed={d.status === "failed" || d.processing_status === "failed"}
              />
            ))}
          </div>
        </section>
      )}

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

      {isLoading && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border/60 bg-surface/40 p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando documentos da API...
        </div>
      )}

      {isError && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">Não consegui falar com {API_BASE}</p>
            <p className="mt-1 text-xs text-muted-foreground">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && list.length === 0 && pending.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-surface/30 p-8 text-center text-sm text-muted-foreground">
          Nenhum documento ainda. Envie o primeiro PDF acima.
        </div>
      )}

      {list.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.slice(0, 8).map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              onProcess={() => reprocess.mutate(doc.id)}
              busy={reprocess.isPending && reprocess.variables === doc.id}
            />
          ))}
        </div>
      )}
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

function DocCard({ doc, onProcess, busy }: { doc: LexDocument; onProcess: () => void; busy: boolean }) {
  const ready = isDocReady(doc);
  const processing = isDocProcessing(doc);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-surface/60 p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-red)]">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
          <FileText className="h-5 w-5" />
        </div>
        <StatusPill doc={doc} />
      </div>

      <h3 className="mt-4 truncate text-sm font-semibold text-foreground" title={doc.filename_original}>
        {doc.filename_original}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {formatBytes(doc.file_size)} · {formatDate(doc.created_at)}
        {doc.logical_type ? ` · ${doc.logical_type}` : doc.document_type ? ` · ${doc.document_type}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ready ? (
          <>
            <ActionBtn icon={BookOpen} label="Resumo" />
            <ActionBtn icon={FileQuestion} label="10 Quiz" />
            <ActionBtn icon={Layers} label="Flashcards" />
            <ActionBtn icon={MessageSquare} label="Chat" href="/app/chat" />
          </>
        ) : processing ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs text-primary">
            <Cog className="h-3 w-3 animate-spin" /> {doc.processing_stage ?? "processando"}
          </span>
        ) : (
          <button
            onClick={onProcess}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            {busy ? "Enfileirando..." : "Processar"}
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

function StatusPill({ doc }: { doc: LexDocument }) {
  const processing = isDocProcessing(doc);
  const ready = isDocReady(doc);
  const failed = doc.status === "failed" || doc.processing_status === "failed";

  const conf = failed
    ? { text: "falhou", cls: "border-primary/40 bg-primary/15 text-primary" }
    : ready
      ? { text: "pronto", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" }
      : processing
        ? { text: doc.processing_stage ?? "processando", cls: "border-primary/30 bg-primary/10 text-primary" }
        : { text: "uploaded", cls: "border-border/60 bg-white/5 text-muted-foreground" };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${conf.cls}`}>
      {conf.text}
    </span>
  );
}
