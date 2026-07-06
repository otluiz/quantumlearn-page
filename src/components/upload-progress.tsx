import { CheckCircle2, Circle, Loader2, AlertTriangle } from "lucide-react";
import type { LexDocument } from "@/lib/api";

/**
 * Estágios do pipeline unificado de upload (10 passos).
 * Mapeia entrada local (HTTP upload) + processing_stage do backend.
 */
export type UploadStage =
  | "receiving"      // 1. Recebendo arquivo (HTTP upload em progresso)
  | "validation"     // 2. Validação do documento (após 2xx, antes do worker)
  | "storage"        // 3. Armazenando em /data/raw (status=uploaded / queued)
  | "extraction"     // 4. Extração PDF → TXT
  | "classification" // 5. Classificação do documento
  | "metadata"       // 6. Geração de metadados
  | "chunking"       // 7. Chunkização
  | "embedding"      // 8. Geração dos embeddings
  | "persistence"    // 9. Persistência no banco
  | "ready";         // 10. Documento pronto

interface StageDef {
  key: UploadStage;
  label: string;
}

export const STAGES: StageDef[] = [
  { key: "receiving", label: "Recebendo arquivo" },
  { key: "validation", label: "Validação do documento" },
  { key: "storage", label: "Armazenando em /data/raw" },
  { key: "extraction", label: "Extração PDF → TXT" },
  { key: "classification", label: "Classificação do documento" },
  { key: "metadata", label: "Geração de metadados" },
  { key: "chunking", label: "Chunkização" },
  { key: "embedding", label: "Geração dos embeddings" },
  { key: "persistence", label: "Persistência no banco" },
  { key: "ready", label: "Documento pronto" },
];

const STAGE_INDEX: Record<UploadStage, number> = STAGES.reduce(
  (acc, s, i) => ({ ...acc, [s.key]: i }),
  {} as Record<UploadStage, number>,
);

/**
 * Deriva o estágio atual a partir de:
 *  - fase local (durante o POST /api/upload)
 *  - doc.status / doc.processing_stage / doc.is_processed vindos do polling
 */
export function deriveStage(input: {
  localPhase?: "uploading" | "validating" | "sent";
  doc?: LexDocument;
}): UploadStage {
  const { localPhase, doc } = input;

  if (!doc) {
    if (localPhase === "uploading") return "receiving";
    if (localPhase === "validating") return "validation";
    return "receiving";
  }

  if (doc.status === "failed" || doc.processing_status === "failed") return "storage";

  if (
    doc.status === "completed" ||
    doc.processing_status === "completed" ||
    doc.is_processed === true ||
    doc.processing_stage === "completed"
  ) {
    return "ready";
  }

  switch (doc.processing_stage) {
    case "extraction":
      return "extraction";
    case "classification":
      return "classification";
    case "chunking":
      return "chunking";
    case "embedding":
      // Depois de embeddings o worker ainda persiste — mostramos "persistence"
      // quando processing_status virou "completed" mas is_processed ainda false.
      return "embedding";
    case "queued":
    case undefined:
    default:
      return "storage";
  }
}

interface Props {
  filename: string;
  stage: UploadStage;
  /** 0-100 para a barra do estágio "receiving" */
  uploadPercent?: number;
  failed?: boolean;
  errorMessage?: string;
  onDismiss?: () => void;
}

export function UploadProgress({
  filename,
  stage,
  uploadPercent,
  failed,
  errorMessage,
  onDismiss,
}: Props) {
  const currentIdx = STAGE_INDEX[stage];
  const totalSteps = STAGES.length;

  // % geral do pipeline: cada estágio pesa 10%, com o "receiving" refinado
  // pelo progresso real do XHR.
  let percent: number;
  if (stage === "ready") {
    percent = 100;
  } else if (stage === "receiving") {
    percent = Math.max(1, Math.round(((uploadPercent ?? 0) / 100) * 10));
  } else {
    percent = Math.round((currentIdx / totalSteps) * 100);
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-surface/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground" title={filename}>
            {filename}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {failed ? "Falha no pipeline" : STAGES[currentIdx].label}
            {stage === "receiving" && uploadPercent != null ? ` · ${uploadPercent}%` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${failed ? "text-primary" : "text-primary/80"}`}>
            {failed ? "!" : `${percent}%`}
          </span>
          {(stage === "ready" || failed) && onDismiss && (
            <button
              onClick={onDismiss}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              ok
            </button>
          )}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            failed
              ? "bg-primary"
              : stage === "ready"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-primary via-primary to-primary/70 shadow-[var(--shadow-glow)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Lista de estágios */}
      <ol className="mt-5 space-y-2">
        {STAGES.map((s, i) => {
          const done = !failed && i < currentIdx;
          const active = !failed && i === currentIdx && stage !== "ready";
          const ready = stage === "ready" && i === currentIdx;
          const errorHere = failed && i === currentIdx;

          return (
            <li key={s.key} className="flex items-center gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center">
                {errorHere ? (
                  <AlertTriangle className="h-4 w-4 text-primary" />
                ) : done || ready ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground/40" />
                )}
              </span>
              <span
                className={`text-xs ${
                  errorHere
                    ? "text-primary"
                    : done || ready
                      ? "text-foreground"
                      : active
                        ? "text-primary font-medium"
                        : "text-muted-foreground/60"
                }`}
              >
                {i + 1}. {s.label}
              </span>
              {active && stage === "receiving" && uploadPercent != null && (
                <span className="ml-auto font-mono text-[10px] text-primary/70">
                  {uploadPercent}%
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {failed && errorMessage && (
        <p className="mt-3 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
