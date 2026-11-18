import { createFileRoute, Link } from "@tanstack/react-router";
import { useStudyContext } from "@/components/study-context";
import { contestMetrics } from "@/lib/study-tools";
import { countdownLabel, daysUntilExam } from "@/lib/study-demo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import toolsCss from "@/styles/study-tools.css?url";

export const Route = createFileRoute("/app/stats")({
  head: () => ({
    links: [{ rel: "stylesheet", href: toolsCss }],
    meta: [
      { title: "Estatísticas — LexLearn" },
      {
        name: "description",
        content: "Acompanhe seu tempo de estudo, revisões e desempenho por tema no LexLearn.",
      },
      { property: "og:title", content: "Estatísticas — LexLearn" },
      {
        property: "og:description",
        content: "Acompanhe seu tempo de estudo, revisões e desempenho por tema no LexLearn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const { contest, today } = useStudyContext();
  const disciplines = contestMetrics(contest);
  const priority = disciplines.flatMap(d => d.topics).filter(t => t.metric).sort((a,b) => ((b.metric?.incidence ?? 0)*(1-(b.metric?.correct ?? 0)/(b.metric?.attempts ?? 1))) - ((a.metric?.incidence ?? 0)*(1-(a.metric?.correct ?? 0)/(a.metric?.attempts ?? 1))));
  return <div className="ls-study"><span className="ls-eyebrow">ESTATÍSTICAS DO ALUNO · DADOS DE EXEMPLO</span><h1>Onde concentrar seu treino</h1><p className="ls-study-intro">{contest.name} · banca do concurso: {contest.board}.</p>
    <p className="ls-tools-status">Todos os resultados e percentuais abaixo são fictícios. Não são seu desempenho real nem uma análise de provas da {contest.board}.</p>
    <section className="ls-tools-section"><h2>{countdownLabel(daysUntilExam(contest.examDate, today))}</h2><p>Contagem até a data de prova de exemplo. Compare seu treino com a incidência ilustrativa da banca do concurso, não com outros alunos.</p></section>
    {disciplines.map(d => {
      const total = d.topics.reduce((n,t) => n+(t.metric?.attempts ?? 0),0);
      const correct = d.topics.reduce((n,t) => n+(t.metric?.correct ?? 0),0);
      return <section key={d.name} className="ls-tools-section"><h2>{d.name}</h2><p>{total ? `${correct} acertos em ${total} questões · ${Math.round(correct/total*100)}% · desempenho de exemplo` : "Sem treino registrado neste exemplo."}</p>
        {d.topics.map(t => <div className="ls-stat-topic" key={t.id}><h3>{t.name}</h3>{t.metric ? <><div><strong>{Math.round(t.metric.correct/t.metric.attempts*100)}%</strong><span>Acertos · exemplo ({t.metric.correct}/{t.metric.attempts})</span><progress max={100} value={t.metric.correct/t.metric.attempts*100} aria-label={`Acertos de exemplo em ${t.name}`} /></div><div className="ls-incidence"><strong>{t.metric.incidence}%</strong><span>“Este tópico caiu em {t.metric.incidence}% das provas da {contest.board}” — exemplo fictício, não apurado.</span><progress max={100} value={t.metric.incidence} aria-label={`Incidência fictícia em ${t.name}`} /></div></> : <><span>Sem desempenho de exemplo.</span><span>Incidência não disponível · ainda não temos.</span></>}</div>)}
      </section>;
    })}
    <section className="ls-tools-section"><h2>Tópicos que mais precisam de treino</h2><p>Prioridade de exemplo: menor acerto combinado com maior incidência fictícia. Não é uma previsão de prova.</p><ul className="ls-priority-list">{priority.map(t => <li key={t.id}>{t.name}<span>{Math.round((t.metric?.correct ?? 0)/(t.metric?.attempts ?? 1)*100)}% de acertos · incidência {t.metric?.incidence}% · exemplo</span></li>)}</ul><Button asChild variant="outline"><Link to="/app/study">Retomar o itinerário <ArrowRight /></Link></Button></section>
  </div>;
}
