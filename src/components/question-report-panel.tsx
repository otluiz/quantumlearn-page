import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPORT_TYPES, validReport, type ReportType } from "@/lib/question-review";

export function QuestionReportPanel({ onReport, onClose, received }: {
  onReport: (type: ReportType, text: string) => boolean;
  onClose: () => void;
  received: boolean;
}) {
  const [type, setType] = useState<ReportType>("Gabarito errado");
  const [text, setText] = useState("");
  return <section className="ls-feedback-panel" aria-label="Reportar problema nesta questão">
    <div className="ls-panel-heading"><h3><Flag />Reportar problema nesta questão</h3><Button variant="ghost" size="icon" aria-label="Fechar relato" title="Fechar relato" onClick={onClose}><X /></Button></div>
    <p className="ls-preview-warning"><strong>PRÉVIA · SIMULAÇÃO LOCAL.</strong> Nada é enviado para revisão real. Sua marcação fica apenas nesta sessão e desaparece ao recarregar.</p>
    {received ? <div role="status" className="ls-report-received"><strong>Confirmação de exemplo</strong><p>Recebido. Sua marcação vai para revisão e não altera o gabarito agora. A questão sai de circulação até a revisão.</p><p>Na prévia, a retirada é apenas local e nenhuma equipe recebe a marcação.</p><Link to="/app">Ver minhas marcações</Link></div>
      : <form onSubmit={event => { event.preventDefault(); if (validReport(type, text)) onReport(type, text.trim()); }}>
        <label htmlFor="report-type">Tipo do problema</label>
        <select id="report-type" value={type} onChange={event => { const found = REPORT_TYPES.find(item => item === event.target.value); if (found) setType(found); }}>{REPORT_TYPES.map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="report-text">Explique o que está errado e, se puder, cite o artigo</label>
        <textarea id="report-text" value={text} onChange={event => setText(event.target.value)} required minLength={30} aria-describedby="report-minimum" rows={5} />
        <p id="report-minimum">Mínimo de 30 caracteres · {text.trim().length}/30</p>
        <Button type="submit" disabled={!validReport(type, text)}>Enviar marcação — simular</Button>
      </form>}
  </section>;
}