import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Bot, User, FileText, Sparkles, Trash2, BrainCircuit, Loader2, AlertTriangle } from "lucide-react";
import { isDocReady, type LexDocument } from "@/lib/api";
import { useAsk, useDocuments } from "@/hooks/use-documents";

export const Route = createFileRoute("/app/chat")({
  head: () => ({ meta: [{ title: "Chat I.A. — Nexlearn" }] }),
  component: ChatPage,
});

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
  time: Date;
  cached?: boolean;
}

const suggestions = [
  "Resuma este documento em 5 pontos",
  "Quantos artigos tem esta lei?",
  "Gere 3 questões de prova sobre este documento",
];

function ChatPage() {
  const { data: docs, isLoading, isError } = useDocuments();
  const ready = useMemo(() => (docs ?? []).filter(isDocReady), [docs]);
  const [selected, setSelected] = useState<LexDocument | null>(null);

  useEffect(() => {
    if (!selected && ready.length > 0) setSelected(ready[0]);
  }, [ready, selected]);

  const ask = useAsk();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, ask.isPending]);

  useEffect(() => {
    if (selected) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: `Documento ativo: **${selected.filename_original}**. Faça uma pergunta ou peça um resumo.`,
          time: new Date(),
        },
      ]);
    }
  }, [selected?.id]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || !selected) return;
    const userMsg: Message = { id: Date.now(), role: "user", content, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    try {
      const resp = await ask.mutateAsync({ question: content, document_id: selected.id });
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: resp.answer ?? "(sem resposta)",
          time: new Date(),
          cached: resp.from_cache,
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ Erro consultando /api/ask: ${(e as Error).message}`,
          time: new Date(),
        },
      ]);
    }
  };

  const time = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Docs sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-[oklch(0.11_0.01_20)] p-4 md:block">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Documentos prontos</p>

        {isLoading && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Carregando…
          </div>
        )}
        {isError && (
          <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-[11px] text-primary">
            {(error as Error)?.message}
          </div>
        )}
        {!isLoading && !isError && ready.length === 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            Nenhum documento processado. Envie um PDF no dashboard.
          </p>
        )}

        <div className="mt-3 space-y-1.5">
          {ready.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selected?.id === d.id
                  ? "border-l-2 border-primary bg-gradient-to-r from-primary/20 to-transparent text-foreground rounded-l-none"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{d.filename_original}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border/40 px-6 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary shadow-[var(--shadow-glow)]">
            <BrainCircuit className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold">Nex I.A.</p>
            <p className="truncate text-xs text-muted-foreground">
              {selected ? `Conversando sobre ${selected.filename_original}` : "Selecione um documento"}
            </p>
          </div>
          <button
            onClick={() =>
              setMessages(
                selected
                  ? [{ id: Date.now(), role: "assistant", content: "Nova conversa iniciada.", time: new Date() }]
                  : [],
              )
            }
            className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {!selected && !isLoading && (
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-5 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
                Nenhum documento pronto para conversar ainda. Assim que um PDF terminar o pipeline ele aparece aqui.
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
                      : "border border-primary/30 bg-primary/10 text-primary"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[75%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/60 bg-surface/60 text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {time(m.time)}
                    {m.cached ? " · cache" : ""}
                  </p>
                </div>
              </div>
            ))}

            {ask.isPending && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-2xl border border-border/60 bg-surface/60 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t border-border/40 px-6 py-4">
          <div className="mx-auto max-w-3xl">
            {selected && messages.length <= 1 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
                  >
                    <Sparkles className="h-3 w-3" /> {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-surface/60 p-2 focus-within:border-primary/50">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={!selected}
                placeholder={selected ? `Pergunte sobre ${selected.filename_original}...` : "Selecione um documento"}
                className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || ask.isPending || !selected}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {ask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
