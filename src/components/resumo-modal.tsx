import { useEffect, useState } from "react";
import { X, RefreshCw, Check, AlertTriangle, ThumbsUp, Loader2 } from "lucide-react";
import { api, type LexDocument, type ResumoData } from "@/lib/api";

interface Props {
  document: LexDocument;
  onClose: () => void;
  addToast?: (msg: string, kind?: "info" | "success" | "error") => void;
}

/**
 * Modal de resumo estruturado — espelha o fluxo do ResumoModal.jsx original:
 * carrega via api.getResumo (cache-first) e permite revisar via api.revisarResumo.
 */
export function ResumoModal({ document: doc, onClose, addToast }: Props) {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<ResumoData | null>(null);
  const [resumoId, setResumoId] = useState<string | number | null>(null);
  const [origem, setOrigem] = useState<string | null>(null);
  const [revisado, setRevisado] = useState(false);

  const carregar = async (forcar = false) => {
    setLoading(true);
    try {
      const resp = await api.getResumo(doc.id, { forcarRegeneracao: forcar });
      setDados(resp.resumo);
      setResumoId(resp.resumo_id);
      setOrigem(resp.origem);
    } catch {
      addToast?.("Não foi possível gerar o resumo.", "error");
      setDados(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id]);

  const confirmar = async () => {
    if (!resumoId) return;
    try {
      await api.revisarResumo(resumoId, "confirmar");
      setRevisado(true);
      addToast?.("Obrigado por confirmar!", "success");
    } catch {
      addToast?.("Não foi possível registrar sua confirmação.", "error");
    }
  };

  const reportar = async () => {
    if (!resumoId) return;
    try {
      await api.revisarResumo(resumoId, "reportar_erro");
      addToast?.("Obrigado por avisar. Vamos revisar este resumo.", "success");
    } catch {
      addToast?.("Não foi possível registrar o report.", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-[var(--shadow-red)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-primary/80">Resumo estruturado</p>
            <h3 className="mt-0.5 truncate font-display text-base font-semibold text-foreground">
              {doc.filename_original}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div>
                <p className="font-medium text-foreground">Gerando resumo…</p>
                <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">
                  Leis grandes podem levar alguns minutos. Você pode fechar esta janela — o
                  resumo continua sendo gerado e estará pronto na próxima vez que abrir.
                </p>
              </div>
            </div>
          )}

          {!loading && dados && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {dados.total_artigos} artigos
                </span>
                {origem?.startsWith("cache") && (
                  <span className="inline-flex rounded-full border border-border/60 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                    resumo pré-computado
                  </span>
                )}
              </div>

              <Section titulo="Ementa" texto={dados.ementa} />
              <Section titulo="Estrutura" texto={dados.estrutura} />

              {dados.principais_artigos && dados.principais_artigos.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Principais artigos
                  </h4>
                  <ul className="space-y-2">
                    {dados.principais_artigos.map((a, i) => (
                      <li
                        key={i}
                        className="rounded-md border-l-2 border-primary/60 bg-white/[0.02] px-3 py-2 text-sm text-foreground/90"
                      >
                        <strong className="text-primary">Art. {a.numero}:</strong> {a.descricao}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Section titulo="Alterações" texto={dados.alteracoes} />
            </>
          )}

          {!loading && !dados && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <p>Não foi possível gerar o resumo agora.</p>
              <button
                onClick={() => carregar(true)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Tentar de novo
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!loading && dados && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-white/[0.02] px-6 py-3">
            <button
              onClick={() => carregar(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Gerar novamente
            </button>
            <div className="flex-1" />
            <button
              onClick={confirmar}
              disabled={revisado}
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60"
            >
              {revisado ? <Check className="h-3.5 w-3.5" /> : <ThumbsUp className="h-3.5 w-3.5" />}
              {revisado ? "Confirmado" : "Está correto"}
            </button>
            <button
              onClick={reportar}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Reportar erro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ titulo, texto }: { titulo: string; texto?: string }) {
  if (!texto || texto.toLowerCase() === "não disponível") return null;
  return (
    <div className="mb-5">
      <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {titulo}
      </h4>
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">{texto}</p>
    </div>
  );
}
