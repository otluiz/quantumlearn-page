import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

export const Route = createFileRoute("/app/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — LexLearn" },
      {
        name: "description",
        content: "Revise conceitos e legislação com flashcards para fortalecer sua preparação.",
      },
      { property: "og:title", content: "Flashcards — LexLearn" },
      {
        property: "og:description",
        content: "Revise conceitos e legislação com flashcards para fortalecer sua preparação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlashcardsPage,
});

const cards = [
  { q: "O que é o princípio da legalidade na Administração Pública?", a: "O administrador só pode fazer aquilo que a lei expressamente autoriza (art. 37, CF/88)." },
  { q: "Quais são os princípios expressos da Administração Pública?", a: "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (LIMPE)." },
  { q: "O que caracteriza improbidade administrativa?", a: "Atos que causam enriquecimento ilícito, prejuízo ao erário ou violam princípios administrativos (Lei 8.429/92)." },
  { q: "Qual o prazo prescricional para ato de improbidade?", a: "8 anos, contados a partir do fato ou, no caso de infração permanente, da cessação." },
];

function FlashcardsPage() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => {
    setFlipped(false);
    setI((prev) => (prev + 1) % cards.length);
  };
  const prev = () => {
    setFlipped(false);
    setI((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const card = cards[i];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <p className="text-xs uppercase tracking-widest text-primary/80">Memorização ativa</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Flashcards</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Baralho: <span className="text-foreground">Direito Constitucional</span> · Card{" "}
        <span className="text-primary">{i + 1}</span>/{cards.length}
      </p>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/40 transition-all"
          style={{ width: `${((i + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        className="mt-8 group relative min-h-[320px] cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-surface/60 p-10 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-red)]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        <div className="relative flex h-full flex-col">
          <span className="text-[10px] uppercase tracking-widest text-primary">
            {flipped ? "Resposta" : "Pergunta"}
          </span>
          <p className="mt-4 font-display text-2xl font-semibold leading-snug text-foreground lg:text-3xl">
            {flipped ? card.a : card.q}
          </p>
          <div className="mt-auto pt-8 text-xs text-muted-foreground">
            Clique no card para {flipped ? "ver a pergunta" : "revelar a resposta"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={prev}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </button>

        <button
          onClick={() => setFlipped((f) => !f)}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary hover:bg-primary/20"
        >
          <RotateCw className="h-4 w-4" /> Virar
        </button>

        <button
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Próximo <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Rate */}
      {flipped && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={next}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 py-3 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            <X className="h-4 w-4" /> Errei
          </button>
          <button
            onClick={next}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
          >
            <Check className="h-4 w-4" /> Acertei
          </button>
        </div>
      )}
    </div>
  );
}
