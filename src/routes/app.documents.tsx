import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Search, Filter, MoreVertical, Loader2, AlertTriangle, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatBytes,
  formatDate,
  isDocProcessing,
  isDocReady,
  type LexDocument,
} from "@/lib/api";

import { useDocuments } from "@/hooks/use-documents";

export const Route = createFileRoute("/app/documents")({
  head: () => ({ meta: [{ title: "Documentos — Nexlearn" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { data, isLoading, isError, error, refetch } = useDocuments();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const list = data ?? [];
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter(
      (d) =>
        d.filename_original.toLowerCase().includes(s) ||
        (d.description ?? "").toLowerCase().includes(s),
    );
  }, [data, q]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary/80">Biblioteca</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="mt-1 text-xs text-muted-foreground">GET {API_BASE}/api/documents</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrar..."
              className="rounded-md border border-border/60 bg-surface/60 py-2 pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 flex items-center gap-2 rounded-xl border border-border/60 bg-surface/40 p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
        </div>
      )}

      {isError && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">Falha ao consultar {API_BASE}</p>
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

      {!isLoading && !isError && rows.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-border/60 bg-surface/30 p-10 text-center text-sm text-muted-foreground">
          Nenhum documento encontrado.
          <div className="mt-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              <Upload className="h-3.5 w-3.5" /> Enviar PDF
            </Link>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-surface/40">
          <table className="w-full">
            <thead className="border-b border-border/60 bg-white/[0.02] text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Tipo</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Tamanho</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Data</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-border/40 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-white/5 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <Link to="/app/chat" className="text-sm font-medium hover:text-primary">
                        {d.filename_original}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Status doc={d} /></td>
                  <td className="hidden px-5 py-4 text-sm text-muted-foreground md:table-cell">
                    {d.logical_type ?? d.document_type ?? "—"}
                  </td>
                  <td className="hidden px-5 py-4 text-sm text-muted-foreground md:table-cell">
                    {formatBytes(d.file_size)}
                  </td>
                  <td className="hidden px-5 py-4 text-sm text-muted-foreground sm:table-cell">
                    {formatDate(d.created_at)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Status({ doc }: { doc: LexDocument }) {
  const processing = isDocProcessing(doc);
  const ready = isDocReady(doc);
  const failed = doc.status === "failed" || doc.processing_status === "failed";

  const conf = failed
    ? { text: "falhou", cls: "border-primary/40 bg-primary/15 text-primary" }
    : ready
      ? { text: "processed", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" }
      : processing
        ? { text: doc.processing_stage ?? "processing", cls: "border-primary/30 bg-primary/10 text-primary" }
        : { text: "uploaded", cls: "border-border/60 bg-white/5 text-muted-foreground" };

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${conf.cls}`}>
      {conf.text}
    </span>
  );
}
