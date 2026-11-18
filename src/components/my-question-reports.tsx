import { Flag } from "lucide-react";
import { useStudyContext } from "@/components/study-context";

export function MyQuestionReports() {
  const { reports } = useStudyContext();
  return <section className="ls-my-reports" aria-label="Minhas marcações">
    <div className="ls-section-heading"><div><span className="ls-eyebrow">PRÉVIA · DADOS DE EXEMPLO</span><h2>Minhas marcações</h2><p>Relatos desta sessão e exemplos fictícios de revisão. Nada foi enviado; não há revisão real conectada.</p></div><Flag aria-hidden="true" /></div>
    <div className="ls-report-list">{reports.map(report => <article className="ls-report-item" key={report.id}>
      <div className="ls-report-item-top"><span className={`ls-review-status ls-review-${report.status === "em revisão" ? "pending" : report.status === "confirmada" ? "confirmed" : "dismissed"}`}>{report.status}</span><span>{report.fixture ? "HISTÓRICO FICTÍCIO" : "MARCAÇÃO LOCAL · EXEMPLO"}</span></div>
      <h3>{report.question}</h3><p>{report.origin}</p><p>Concurso: {report.contest}</p><strong>{report.type}</strong><p>{report.explanation}</p>
      {report.review ? <div className="ls-review-reply"><strong>Resposta da revisão — exemplo</strong><p>{report.review}</p></div> : <p className="ls-review-reply">Em revisão neste exemplo. Gabarito inalterado; questão retirada do treino desta sessão.</p>}
    </article>)}</div>
  </section>;
}