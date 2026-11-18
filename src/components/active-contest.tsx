import { CalendarDays, Target, Info } from "lucide-react";
import { useStudyContext } from "@/components/study-context";
import { DEMO_CONTESTS, countdownLabel, daysUntilExam } from "@/lib/study-demo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ActiveContest() {
  const { contest, selectContest, trainingBoard, extraBoard, today, followedIds } = useStudyContext();
  return <section className="ls-contest" aria-label="Concurso ativo">
    <div className="ls-contest-main">
      <Target className="ls-contest-icon" aria-hidden="true" />
      <div className="ls-contest-choice">
        <label className="ls-eyebrow" id="active-contest-label">CONCURSO ATIVO · EXEMPLO</label>
        <Select value={contest.id} onValueChange={selectContest}>
          <SelectTrigger aria-labelledby="active-contest-label"><SelectValue /></SelectTrigger>
          <SelectContent className="lexpubli ll-workspace ll-workspace-menu">
            {DEMO_CONTESTS.filter(item => followedIds.includes(item.id)).map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <p>{contest.role} <span aria-hidden="true">·</span> Banca do concurso: <strong>{contest.board}</strong></p>
      </div>
      <div className="ls-exam"><CalendarDays aria-hidden="true" /><div>
        <span>Prova de exemplo · {new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(contest.examDate + "T00:00:00Z"))}</span>
        <strong>{countdownLabel(daysUntilExam(contest.examDate, today))}</strong>
      </div></div>
    </div>
    <div className="ls-contest-note">
      <span><Info aria-hidden="true" />Demonstração: concursos, datas, edital e materiais de exemplo. Escolhas apenas nesta sessão.</span>
      <strong>{extraBoard ? `Treino adicional ativo: ${trainingBoard} · banca do concurso: ${contest.board}` : `Treino com a banca do concurso: ${trainingBoard}`}</strong>
    </div>
  </section>;
}