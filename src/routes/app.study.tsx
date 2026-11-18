import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ChevronRight, FileText, Layers, Info, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudyContext } from "@/components/study-context";
import { StudyPractice } from "@/components/study-practice";
import { DEMO_BOARDS, type Resource, type StudyTopic } from "@/lib/study-demo";

export const Route = createFileRoute("/app/study")({
  head: () => ({
    meta: [
      { title: "Estudar — LexLearn" },
      {
        name: "description",
        content: "Explore um itinerário de edital de exemplo e treine para seu concurso com questões, resumos, flashcards e fundamento no texto oficial da lei.",
      },
      { property: "og:title", content: "Estudar — LexLearn" },
      {
        property: "og:description",
        content: "Seu concurso orienta o treino. Demonstração de edital, bancas e questões com referências à legislação oficial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyPage,
});

function StudyPage() {
  const { contest, trainingBoard } = useStudyContext();
  return <StudyItinerary key={`${contest.id}-${trainingBoard}`} />;
}
const resources: { id: Resource; name: string; icon: typeof BookOpen }[] = [
  { id: "questoes", name: "Questões", icon: FileText },
  { id: "resumo", name: "Resumo", icon: BookOpen },
  { id: "flashcards", name: "Flashcards", icon: Layers },
];
function StudyItinerary() {
  const { contest, extraBoard, setExtraBoard, trainingBoard } = useStudyContext();
  const initial = contest.disciplines.flatMap((item) => item.topics).find((topic) => topic.resources.includes("questoes"));
  const [selected, setSelected] = useState<{ topic: StudyTopic; resource: Resource } | null>(initial ? { topic: initial, resource: "questoes" } : null);
  function openResource(topic: StudyTopic, resource: Resource) {
    setSelected({ topic, resource });
    window.requestAnimationFrame(() => document.getElementById("study-material")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }));
  }
  return <div className="ls-study">
    <div className="ls-study-top"><div><span className="ls-eyebrow">DA INSCRIÇÃO À PROVA</span><h1>Seu edital, seu caminho.</h1><p className="ls-study-intro">Preparação para {contest.role}. Treino com a banca {trainingBoard}, com respostas ancoradas na lei.</p></div><span className="ls-demo-label"><Info />DADOS DE EXEMPLO</span></div>
    <section className="ls-board-controls" aria-label="Banca de treino">
      <p>Banca do concurso: <strong>{contest.board}</strong></p>
      <div className="ls-board-option"><Checkbox id="extra-board" checked={extraBoard !== null} onCheckedChange={(checked) => setExtraBoard(checked === true ? DEMO_BOARDS.find((board) => board !== contest.board) ?? null : null)} /><label htmlFor="extra-board">Treinar também com o estilo de outra banca</label></div>
      {extraBoard && <div className="ls-board-select"><Select value={extraBoard} onValueChange={setExtraBoard}><SelectTrigger aria-label="Outra banca"><SelectValue /></SelectTrigger><SelectContent className="lexpubli ll-workspace ll-workspace-menu">{DEMO_BOARDS.filter((board) => board !== contest.board).map((board) => <SelectItem key={board} value={board}>{board}</SelectItem>)}</SelectContent></Select></div>}
      <span className="ls-bank-label">{extraBoard ? `Estilo adicional ativo: ${trainingBoard}` : `Estilo do concurso: ${trainingBoard}`}</span>
    </section>
    <section aria-label="Itinerário do edital"><div className="ls-section-heading"><div><span className="ls-eyebrow">CONTEÚDO PROGRAMÁTICO · EXEMPLO</span><h2>Itinerário do edital</h2><p>Disponibilidade ilustrativa por disciplina e tópico, sem promessa de cobertura integral.</p></div></div>
      <div className="ls-itinerary">{contest.disciplines.map((discipline) => <details className="ls-discipline" key={discipline.name} open><summary><ChevronRight />{discipline.name}</summary>{discipline.topics.map((topic) => <div className="ls-topic" key={topic.id}><h3>{topic.name}</h3><div className="ls-topic-resources">{resources.map((resource) => topic.resources.includes(resource.id)
        ? <Button variant="outline" key={resource.id} aria-label={`${resource.name} — ${topic.name}`} onClick={() => openResource(topic, resource.id)}><resource.icon />{resource.name}</Button>
        : <span className="ls-missing" key={resource.id}><CircleDashed />{resource.name}: ainda não temos</span>)}</div></div>)}</details>)}</div>
      <p className="ls-itinerary-note">Edital fictício e materiais ilustrativos. As lacunas acima pertencem a este exemplo; não representam o edital nem a cobertura de um concurso real.</p>
    </section>
    {selected && <StudyPractice key={`${selected.topic.id}-${selected.resource}`} topic={selected.topic} resource={selected.resource} />}
  </div>;
}
