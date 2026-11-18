import { expect, test } from "bun:test";
import { contestCards, contestMetrics, scheduleReview, validDailyGoal, removeFollowedContest } from "../src/lib/study-tools";
import { DEMO_CONTESTS } from "../src/lib/study-demo";

test("all three flashcard ratings schedule different future reviews", () => {
  expect(scheduleReview("card", "errei", 0).dueAt).toBe(600000);
  expect(scheduleReview("card", "dificil", 0).dueAt).toBe(86400000);
  expect(scheduleReview("card", "acertei", 0).dueAt).toBe(259200000);
});
test("cards come only from the active contest itinerary and retain legal grounding", () => {
  const contest = DEMO_CONTESTS[1];
  if (!contest) throw new Error("Missing fixture");
  const cards = contestCards(contest);
  expect(cards.map(c => c.key)).toEqual(["prefeitura:principios", "prefeitura:direitos"]);
  for (const card of cards) {
    expect(card.topic.flashcard?.back.length).toBeGreaterThan(0);
    expect(card.topic.article?.length).toBeGreaterThan(0);
    expect(card.topic.officialUrl?.startsWith("https://www.planalto.gov.br/")).toBe(true);
  }
});
test("removing followed contests preserves at least one contest", () => {
  expect(removeFollowedContest(["tribunal", "prefeitura"], "tribunal")).toEqual(["prefeitura"]);
  expect(removeFollowedContest(["prefeitura"], "prefeitura")).toEqual(["prefeitura"]);
});
test("daily goal accepts only whole minutes in the preview bounds", () => {
  expect(validDailyGoal(30)).toBe(true);
  expect(validDailyGoal(4)).toBe(false);
  expect(validDailyGoal(241)).toBe(false);
  expect(validDailyGoal(30.5)).toBe(false);
});
test("statistics include only the active contest topics and leave missing metrics empty", () => {
  const contest = DEMO_CONTESTS[1];
  if (!contest) throw new Error("Missing fixture");
  const metrics = contestMetrics(contest).flatMap(d => d.topics);
  expect(metrics.find(t => t.id === "principios")?.metric).toEqual({ correct: 4, attempts: 10, incidence: 70 });
  expect(metrics.find(t => t.id === "lei-organica")?.metric).toBeUndefined();
  expect(metrics.some(t => t.id === "regimento")).toBe(false);
});