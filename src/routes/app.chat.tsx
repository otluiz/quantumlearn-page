import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, FileText, Sparkles, Trash2, BrainCircuit } from "lucide-react";

export const Route = createFileRoute("/app/chat")({
  head: () => ({ meta: [{ title: "Chat I.A. — Nexlearn" }] }),
  component: ChatPage,
});

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
  time: Date;
}

const docs = [
  { id: "1", name: "Direito_Constitucional.pdf" },
  { id: "2", name: "L8069_ECA.pdf" },
  { id: "3", name: "lei_8429_improbidade.pdf" },
];

const suggestions = [
  "Resuma o capítulo 3 em 5 pontos",
  "Quais os princípios da administração pública?",
  "Gere 3 questões de prova sobre este documento",
];

function ChatPage() {
  const [selected, setSelected] = useState(docs[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Documento ativo: **${docs[0].name}**. Faça uma pergunta ou peça um resumo.`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: Message = { id: Date.now(), role: "user", content, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Com base em **${selected.name}**, aqui está uma resposta contextual sobre "${content}". O motor de RAG está indexando ${Math.floor(Math.random() * 40 + 20)} chunks relevantes para responder com precisão.`,
          time: new Date(),
        },
      ]);
      setThinking(false);
    }, 1400);
  };

  const time = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(d);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Docs sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-[oklch(0.11_0.01_20)] p-4 md:block">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Documento ativo</p>
        <div className="mt-3 space-y-1.5">
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelected(d);
                setMessages([
                  {
                    id: Date.now(),
                    role: "assistant",
                    content: `Documento ativo: **${d.name}**. Faça uma pergunta.`,
                    time: new Date(),
                  },
                ]);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selected.id === d.id
                  ? "border-l-2 border-primary bg-gradient-to-r from-primary/20 to-transparent text-foreground rounded-l-none"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{d.name}</span>
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
            <p className="truncate text-xs text-muted-foreground">Conversando sobre {selected.name}</p>
          </div>
          <button
            onClick={() =>
              setMessages([
                { id: Date.now(), role: "assistant", content: "Nova conversa iniciada.", time: new Date() },
              ])
            }
            className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
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
                  <p className="mt-1 text-[10px] text-muted-foreground">{time(m.time)}</p>
                </div>
              </div>
            ))}

            {thinking && (
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

        {/* Suggestions + input */}
        <div className="border-t border-border/40 px-6 py-4">
          <div className="mx-auto max-w-3xl">
            {messages.length <= 1 && (
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
                placeholder={`Pergunte sobre ${selected.name}...`}
                className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || thinking}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
