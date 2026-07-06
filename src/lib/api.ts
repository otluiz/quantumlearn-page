/**
 * LexLearn API client — unified with the document_pipeline.md contract.
 *
 * Base URL vem de VITE_API_URL (default http://localhost:8182).
 * Endpoints cobertos:
 *   GET    /api/health
 *   GET    /api/documents
 *   GET    /api/documents/:id
 *   POST   /api/upload            (multipart: file)
 *   POST   /api/process/:id       (reprocessar)
 *   PATCH  /api/documents/:id     (alterar tipo/descrição)
 *   POST   /api/ask               ({ question, document_id })
 *   POST   /api/quiz              ({ document_id })
 */

export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  "http://localhost:8182";

// ---------- Types (espelham o schema `documents` do pipeline) ----------

export type DocumentType = "law" | "exam" | "answer_key" | "mixed" | "unknown";
export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";
export type ProcessingStage =
  | "queued"
  | "extraction"
  | "chunking"
  | "embedding"
  | "classification"
  | "completed";

export interface LexDocument {
  id: string | number;
  filename_original: string;
  document_type?: DocumentType;
  logical_type?: DocumentType;
  status: DocumentStatus;
  description?: string | null;
  file_path?: string | null;
  processed_text_path?: string | null;
  is_processed?: boolean;
  processing_status?: "pending" | "running" | "completed" | "failed";
  processing_stage?: ProcessingStage;
  analysis_metadata?: Record<string, unknown> | null;
  file_size?: number | null;
  priority?: number | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | number | null;
}

export interface AskRequest {
  question: string;
  document_id?: string | number;
}

export interface AskResponse {
  answer: string;
  sources?: Array<{ chunk_id?: string | number; content?: string; score?: number }>;
  from_cache?: boolean;
}

// ---------- Core fetch ----------

class ApiError extends Error {
  constructor(
    public status: number,
    public url: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.text();
      if (body) msg += ` — ${body.slice(0, 300)}`;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, url, msg);
  }

  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  return (ct.includes("application/json") ? await res.json() : (await res.text() as unknown)) as T;
}

// ---------- Endpoints ----------

export const api = {
  health: () => request<{ status: string } | string>("/api/health"),

  listDocuments: () => request<LexDocument[]>("/api/documents"),

  getDocument: (id: string | number) =>
    request<LexDocument>(`/api/documents/${encodeURIComponent(String(id))}`),

  patchDocument: (
    id: string | number,
    patch: Partial<Pick<LexDocument, "document_type" | "logical_type" | "description">>,
  ) =>
    request<LexDocument>(`/api/documents/${encodeURIComponent(String(id))}`, {
      method: "PATCH",
      json: patch,
    }),

  upload: (file: File, description?: string) => {
    const form = new FormData();
    form.append("file", file);
    if (description) form.append("description", description);
    return request<LexDocument>("/api/upload", {
      method: "POST",
      body: form,
    });
  },

  reprocess: (id: string | number) =>
    request<LexDocument>(`/api/process/${encodeURIComponent(String(id))}`, {
      method: "POST",
    }),

  ask: (payload: AskRequest) =>
    request<AskResponse>("/api/ask", { method: "POST", json: payload }),

  quiz: (documentId: string | number) =>
    request<unknown>("/api/quiz", { method: "POST", json: { document_id: documentId } }),
};

// ---------- Helpers de UI ----------

export function isDocProcessing(doc: LexDocument): boolean {
  if (doc.status === "processing") return true;
  if (doc.processing_status === "running" || doc.processing_status === "pending") return true;
  if (doc.processing_stage && doc.processing_stage !== "completed") return true;
  return false;
}

export function isDocReady(doc: LexDocument): boolean {
  return (
    doc.status === "completed" ||
    doc.processing_status === "completed" ||
    doc.is_processed === true ||
    doc.processing_stage === "completed"
  );
}

export function formatBytes(size?: number | null): string {
  if (!size || size <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = size;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
