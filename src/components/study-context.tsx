import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_CONTESTS, DEMO_REFERENCE_DATE, resolveTrainingBoard, type DemoContest } from "@/lib/study-demo";
import { EXAMPLE_REPORTS, validReport, isQuestionWithdrawn, type QuestionReport } from "@/lib/question-review";

interface StudyContextValue {
  contest: DemoContest;
  selectContest: (id: string) => void;
  extraBoard: string | null;
  setExtraBoard: (board: string | null) => void;
  trainingBoard: string;
  today: string;
  reports: QuestionReport[];
  addReport: (report: Omit<QuestionReport, "id" | "status" | "fixture">) => boolean;
}
const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [contestId, setContestId] = useState("tribunal");
  const [extraBoard, setExtraBoard] = useState<string | null>(null);
  const [today, setToday] = useState(DEMO_REFERENCE_DATE);
  const [reports, setReports] = useState<QuestionReport[]>(EXAMPLE_REPORTS);
  const contest = DEMO_CONTESTS.find((item) => item.id === contestId) ?? DEMO_CONTESTS[0];
  useEffect(() => {
    const refresh = () => setToday(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Recife", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()));
    refresh();
    const interval = window.setInterval(refresh, 60000);
    return () => window.clearInterval(interval);
  }, []);
  if (!contest) return null;
  function selectContest(id: string) {
    if (!DEMO_CONTESTS.some((item) => item.id === id)) return;
    setContestId(id);
    setExtraBoard(null);
  }
  function addReport(report: Omit<QuestionReport, "id" | "status" | "fixture">) {
    if (!validReport(report.type, report.explanation) || isQuestionWithdrawn(reports, report.questionKey)) return false;
    const item: QuestionReport = { ...report, explanation: report.explanation.trim(), id: crypto.randomUUID(), status: "em revisão", fixture: false };
    setReports(previous => isQuestionWithdrawn(previous, report.questionKey) ? previous : [item, ...previous]);
    return true;
  }
  return <StudyContext.Provider value={{ contest, selectContest, extraBoard, setExtraBoard,
    trainingBoard: resolveTrainingBoard(contest, extraBoard), today, reports, addReport }}>{children}</StudyContext.Provider>;
}
export function useStudyContext() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("Study context must be used within its provider");
  return context;
}