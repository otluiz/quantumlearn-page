import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight, X, Check, CircleHelp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyContext } from "@/components/study-context";
import { contestCards, type ReviewRating } from "@/lib/study-tools";
import toolsCss from "@/styles/study-tools.css?url";

export const Route = createFileRoute("/app/flashcards")({
  head: () => ({
    links: [{ rel: "stylesheet", href: toolsCss }],
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

function FlashcardsPage() {
  const { contest } = useStudyContext();
  return <ContestFlashcards key={contest.id} />;
}
function ContestFlashcards() {
  const { contest, reviews, rateCard } = useStudyContext();
  const cards = contestCards(contest);
  const [topicId, setTopicId] = useState("todos");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const visible = cards.filter(card => topicId === "todos" || card.topic.id === topicId);
  const card = visible[index];
  const topics = contest.disciplines.flatMap(d => d.topics);
  function move(delta: number) { if (!visible.length) return; setIndex(i => (i + delta + visible.length) % visible.length); setFlipped(false); }
  function rate(rating: ReviewRating) {
    if (!card || !flipped) return;
    rateCard(card.key, rating);
    setMessage(`Revisão de exemplo registrada: ${rating === "dificil" ? "difícil" : rating}. Próxima revisão ${rating === "errei" ? "em 10 minutos" : rating === "dificil" ? "em 1 dia" : "em 3 dias"}. Apenas nesta sessão.`);
    move(1);
  }
  const review = reviews.find(item => item.key === card?.key);
  return <div className="ls-study">
    <span className="ls-eyebrow">REVISÃO DO EDITAL · EXEMPLO</span><h1>Flashcards do seu concurso</h1>
    <p className="ls-study-intro">{contest.name} · {contest.role}. Cartões e agenda de revisão ilustrativos, sem histórico real conectado.</p>
    <label className="ls-tools-field">Tópico do itinerário<select aria-label="Tópico do itinerário" value={topicId} onChange={e => { setTopicId(e.target.value); setIndex(0); setFlipped(false); setMessage(""); }}><option value="todos">Todos os tópicos disponíveis</option>{contest.disciplines.map(d => <optgroup key={d.name} label={d.name}>{d.topics.map(t => <option key={t.id} value={t.id}>{t.name}{t.flashcard ? "" : " — ainda não temos"}</option>)}</optgroup>)}</select></label>
    {card ? <>
      <article className="ls-flashcard" aria-label="Cartão de revisão">
        <span className="ls-eyebrow">{flipped ? "RESPOSTA · EXEMPLO" : "PERGUNTA · EXEMPLO"}</span>
        <p className="ls-card-context">{contest.name}<br />{card.discipline} · {card.topic.name}</p>
        <p className="ls-card-question">{flipped ? card.topic.flashcard?.back : card.topic.flashcard?.front}</p>
        {flipped && <div className="ls-card-law"><strong>{card.topic.article}</strong><blockquote>“{card.topic.lawText}”</blockquote><a href={card.topic.officialUrl} target="_blank" rel="noopener noreferrer">Conferir no texto oficial <ExternalLink size={14} /></a></div>}
      </article>
      <div className="ls-tools-actions"><Button variant="outline" size="icon" aria-label="Cartão anterior" title="Cartão anterior" onClick={() => move(-1)}><ChevronLeft /></Button><Button variant="outline" onClick={() => setFlipped(!flipped)}><RotateCw />{flipped ? "Ver pergunta" : "Revelar resposta"}</Button><Button variant="outline" size="icon" aria-label="Próximo cartão" title="Próximo cartão" onClick={() => move(1)}><ChevronRight /></Button><span className="ls-tools-note">Cartão {index+1} de {visible.length} · exemplo</span></div>
      <div className="ls-review-ratings"><Button variant="outline" disabled={!flipped} onClick={() => rate("errei")}><X />Errei<small>Rever em 10 min · exemplo</small></Button><Button variant="outline" disabled={!flipped} onClick={() => rate("dificil")}><CircleHelp />Difícil<small>Rever em 1 dia · exemplo</small></Button><Button variant="outline" disabled={!flipped} onClick={() => rate("acertei")}><Check />Acertei<small>Rever em 3 dias · exemplo</small></Button></div>
      {review && <p className="ls-tools-note">Revisão agendada nesta sessão: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(review.dueAt))} · exemplo.</p>}
    </> : <p className="ls-tools-status">Ainda não temos flashcards para este tópico neste exemplo.</p>}
    {message && <p role="status" className="ls-tools-status">{message}</p>}
    <section className="ls-tools-section"><h2>Lacunas do itinerário</h2>{topics.filter(t => !t.flashcard).map(t => <p key={t.id}>{t.name} · ainda não temos flashcards neste exemplo.</p>)}</section>
  </div>;
}
