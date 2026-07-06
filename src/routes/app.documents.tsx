import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Search, Filter, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/app/documents")({
  head: () => ({ meta: [{ title: "Documentos — Nexlearn" }] }),
  component: DocumentsPage,
});

const docs = [
  { name: "Direito_Constitucional.pdf", size: "3.1 MB", date: "04 jan 2026", status: "processed", chunks: 128 },
  { name: "L9394_LDB.pdf", size: "1.4 MB", date: "11 fev 2026", status: "processing", chunks: 0 },
  { name: "L8112_ServPubFed.pdf", size: "2.7 MB", date: "14 fev 2026", status: "uploaded", chunks: 0 },
  { name: "L8069_ECA.pdf", size: "0.9 MB", date: "18 fev 2026", status: "processed", chunks: 42 },
  { name: "L11892_ETPF.pdf", size: "1.1 MB", date: "20 fev 2026", status: "processed", chunks: 58 },
  { name: "D54142_PE.pdf", size: "0.5 MB", date: "22 fev 2026", status: "uploaded", chunks: 0 },
  { name: "lei_8429_improbidade.pdf", size: "1.8 MB", date: "25 fev 2026", status: "processed", chunks: 74 },
  { name: "D1171.pdf", size: "0.08 MB", date: "23 jan 2026", status: "processed", chunks: 12 },
];

function DocumentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary/80">Biblioteca</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Documentos</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Filtrar..."
              className="rounded-md border border-border/60 bg-surface/60 py-2 pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-surface/40">
        <table className="w-full">
          <thead className="border-b border-border/60 bg-white/[0.02] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Tamanho</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Chunks</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Data</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.name} className="border-b border-border/40 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-white/5 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                    </div>
                    <Link to="/app/chat" className="text-sm font-medium hover:text-primary">
                      {d.name}
                    </Link>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Status status={d.status} />
                </td>
                <td className="hidden px-5 py-4 text-sm text-muted-foreground md:table-cell">{d.size}</td>
                <td className="hidden px-5 py-4 text-sm text-muted-foreground md:table-cell">{d.chunks}</td>
                <td className="hidden px-5 py-4 text-sm text-muted-foreground sm:table-cell">{d.date}</td>
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
    </div>
  );
}

function Status({ status }: { status: string }) {
  const map: Record<string, string> = {
    uploaded: "border-border/60 bg-white/5 text-muted-foreground",
    processing: "border-primary/30 bg-primary/10 text-primary",
    processed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
