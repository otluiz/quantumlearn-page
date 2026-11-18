import type { DemoContest } from "@/lib/study-demo";

export type ReviewRating = "errei" | "dificil" | "acertei";
export interface CardReview { key: string; rating: ReviewRating; dueAt: number; }
/** Simple preview intervals, not an adaptive production scheduler. */
export function scheduleReview(key: string, rating: ReviewRating, now: number): CardReview {
  const intervals = { errei: 10 * 60000, dificil: 86400000, acertei: 3 * 86400000 };
  return { key, rating, dueAt: now + intervals[rating] };
}
export function validDailyGoal(value: number) { return Number.isInteger(value) && value >= 5 && value <= 240; }
export function removeFollowedContest(ids: string[], id: string): string[] {
  return ids.length <= 1 ? ids : ids.filter(item => item !== id);
}
export function contestCards(contest: DemoContest) {
  return contest.disciplines.flatMap(discipline => discipline.topics.filter(topic => topic.resources.includes("flashcards") && topic.flashcard).map(topic => ({ topic, discipline: discipline.name, key: `${contest.id}:${topic.id}` })));
}
/** Literal synthetic data: no claims about actual historical bank incidence. */
const EXAMPLE_METRICS: Record<string, { correct: number; attempts: number; incidence: number }> = {
  direitos: { correct: 6, attempts: 10, incidence: 40 },
  principios: { correct: 4, attempts: 10, incidence: 70 },
  estabilidade: { correct: 8, attempts: 10, incidence: 30 },
};
export function contestMetrics(contest: DemoContest) {
  return contest.disciplines.map(discipline => ({ name: discipline.name, topics: discipline.topics.map(topic => ({ ...topic, metric: EXAMPLE_METRICS[topic.id] })) }));
}