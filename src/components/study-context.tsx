import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_CONTESTS, DEMO_REFERENCE_DATE, resolveTrainingBoard, type DemoContest } from "@/lib/study-demo";
import { EXAMPLE_REPORTS, validReport, isQuestionWithdrawn, type QuestionReport } from "@/lib/question-review";
import { scheduleReview, validDailyGoal, removeFollowedContest, type CardReview, type ReviewRating } from "@/lib/study-tools";

interface StudyContextValue {
  contest: DemoContest;
  selectContest: (id: string) => void;
  extraBoard: string | null;
  setExtraBoard: (board: string | null) => void;
  trainingBoard: string;
  today: string;
  reports: QuestionReport[];
  addReport: (report: Omit<QuestionReport, "id" | "status" | "fixture">) => boolean;
  followedIds: string[];
  followContest: (id: string) => void;
  unfollowContest: (id: string) => void;
  dailyGoal: number;
  setDailyGoal: (value: number) => void;
  alerts: { exam: boolean; notice: boolean };
  setAlerts: (value: { exam: boolean; notice: boolean }) => void;
  reviews: CardReview[];
  rateCard: (key: string, rating: ReviewRating) => void;
  clearDemoData: () => void;
}
const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [contestId, setContestId] = useState("tribunal");
  const [extraBoard, setExtraBoard] = useState<string | null>(null);
  const [today, setToday] = useState(DEMO_REFERENCE_DATE);
  const [reports, setReports] = useState<QuestionReport[]>(EXAMPLE_REPORTS);
  const [followedIds, setFollowedIds] = useState<string[]>(DEMO_CONTESTS.map(item => item.id));
  const [dailyGoal, updateDailyGoal] = useState(30);
  const [alerts, setAlerts] = useState({ exam: false, notice: false });
  const [reviews, setReviews] = useState<CardReview[]>([]);
  const contest = DEMO_CONTESTS.find((item) => item.id === contestId) ?? DEMO_CONTESTS[0];
  useEffect(() => {
    const refresh = () => setToday(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Recife", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()));
    refresh();
    const interval = window.setInterval(refresh, 60000);
    return () => window.clearInterval(interval);
  }, []);
  if (!contest) return null;
  function selectContest(id: string) {
    if (!followedIds.includes(id)) return;
    setContestId(id);
    setExtraBoard(null);
  }
  function followContest(id: string) {
    if (DEMO_CONTESTS.some(item => item.id === id)) setFollowedIds(previous => previous.includes(id) ? previous : [...previous, id]);
  }
  function unfollowContest(id: string) {
    const next = removeFollowedContest(followedIds, id);
    setFollowedIds(next);
    if (id === contestId && next[0] && !next.includes(id)) { setContestId(next[0]); setExtraBoard(null); }
  }
  function rateCard(key: string, rating: ReviewRating) {
    const review = scheduleReview(key, rating, Date.now());
    setReviews(previous => [...previous.filter(item => item.key !== key), review]);
  }
  function clearDemoData() {
    setReports([]); setReviews([]); setAlerts({ exam: false, notice: false }); updateDailyGoal(30);
    setFollowedIds(DEMO_CONTESTS.map(item => item.id)); setContestId("tribunal"); setExtraBoard(null);
  }
  function addReport(report: Omit<QuestionReport, "id" | "status" | "fixture">) {
    if (!validReport(report.type, report.explanation) || isQuestionWithdrawn(reports, report.questionKey)) return false;
    const item: QuestionReport = { ...report, explanation: report.explanation.trim(), id: crypto.randomUUID(), status: "em revisão", fixture: false };
    setReports(previous => isQuestionWithdrawn(previous, report.questionKey) ? previous : [item, ...previous]);
    return true;
  }
  return <StudyContext.Provider value={{ contest, selectContest, extraBoard, setExtraBoard,
    trainingBoard: resolveTrainingBoard(contest, extraBoard), today, reports, addReport,
    followedIds, followContest, unfollowContest, dailyGoal, setDailyGoal: value => { if (validDailyGoal(value)) updateDailyGoal(value); },
    alerts, setAlerts, reviews, rateCard, clearDemoData }}>{children}</StudyContext.Provider>;
}
export function useStudyContext() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("Study context must be used within its provider");
  return context;
}