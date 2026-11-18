import { describe, expect, test } from "bun:test";
import { DEMO_CONTESTS, daysUntilExam, countdownLabel, resolveTrainingBoard, questionOrigin } from "../src/lib/study-demo";

describe("Contest-oriented study rules", () => {
  test("counts calendar days up to the example exam, including the requested 32-day case", () => {
    expect(daysUntilExam("2026-12-19", "2026-11-17")).toBe(32);
    expect(countdownLabel(32)).toBe("Faltam 32 dias");
    expect(daysUntilExam("2026-12-19", "2026-12-19")).toBe(0);
    expect(countdownLabel(-1)).toBe("Data de exemplo já passou");
  });
  test("uses the contest board by default and the explicit extra board when selected", () => {
    const contest = DEMO_CONTESTS[0];
    if (!contest) throw new Error("Missing example contest");
    expect(resolveTrainingBoard(contest, null)).toBe("FCC");
    expect(resolveTrainingBoard(contest, "FGV")).toBe("FGV");
  });
  test("keeps both origin kinds distinguishable and linked to the chosen board and contest", () => {
    const contest = DEMO_CONTESTS[1];
    if (!contest) throw new Error("Missing example contest");
    expect(questionOrigin("anterior", contest, "Vunesp")).toContain("Prova anterior — Vunesp, Prefeitura Municipal");
    expect(questionOrigin("inedita", contest, "Vunesp")).toContain("Questão inédita no estilo da banca Vunesp, gerada para o concurso Prefeitura Municipal");
  });
  test("question resources always include an answer and an official law source", () => {
    const topics = DEMO_CONTESTS.flatMap(contest => contest.disciplines.flatMap(d => d.topics));
    const questions = topics.filter(topic => topic.resources.includes("questoes"));
    expect(questions.length).toBeGreaterThan(0);
    for (const topic of questions) {
      expect(topic.correct).toBeGreaterThanOrEqual(0);
      expect(topic.correct).toBeLessThan(topic.choices?.length ?? 0);
      expect(topic.officialUrl?.startsWith("https://www.planalto.gov.br/")).toBe(true);
      expect(topic.lawText?.length).toBeGreaterThan(0);
    }
  });
  test("example itinerary declares both available and missing resources", () => {
    const contest = DEMO_CONTESTS[0];
    if (!contest) throw new Error("Missing example contest");
    const topics = contest.disciplines.flatMap(d => d.topics);
    expect(topics.find(t => t.id === "principios")?.resources).toEqual(["questoes", "resumo", "flashcards"]);
    expect(topics.find(t => t.id === "regimento")?.resources).toEqual([]);
  });
});