import { expect, test } from "bun:test";
import { REPORT_TYPES, validReport, isQuestionWithdrawn, questionKey, exampleReply, EXAMPLE_REPORTS, type QuestionReport } from "../src/lib/question-review";
import { DEMO_CONTESTS } from "../src/lib/study-demo";

test("reports require an allowed problem type and at least 30 non-padding characters", () => {
  expect(validReport("Gabarito errado", "a".repeat(29))).toBe(false);
  expect(validReport("Gabarito errado", "a".repeat(30))).toBe(true);
  expect(validReport("Outro", " ".repeat(30))).toBe(false);
  expect(validReport("Curtir", "a".repeat(30))).toBe(false);
  expect(REPORT_TYPES).toHaveLength(5);
});
test("reports withdraw the exact question while pending or confirmed, not dismissed", () => {
  const key = questionKey("tribunal", "FCC", "direitos", "inedita");
  const report: QuestionReport = { ...EXAMPLE_REPORTS[0], id: "test", questionKey: key, question: "Teste", origin: "Exemplo", contest: "Exemplo", type: "Outro", explanation: "a".repeat(30), fixture: false, status: "em revisão" };
  expect(isQuestionWithdrawn([report], key)).toBe(true);
  expect(isQuestionWithdrawn([{ ...report, status: "confirmada" }], key)).toBe(true);
  expect(isQuestionWithdrawn([{ ...report, status: "descartada" }], key)).toBe(false);
  expect(isQuestionWithdrawn([report], questionKey("prefeitura", "FCC", "direitos", "inedita"))).toBe(false);
});
test("affirmative example answers include the law article, applicable inciso and official link", () => {
  const topic = DEMO_CONTESTS[0]?.disciplines.flatMap(item => item.topics).find(item => item.id === "direitos");
  if (!topic) throw new Error("Missing rights fixture");
  const reply = exampleReply(topic, "fundamento");
  expect(reply.citation).toContain("art. 5º, II");
  expect(reply.citation).toContain("inciso utilizado: II");
  expect(reply.url).toBe("https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art5");
  expect(reply.missing).toBe(false);
});
test("outside-material answers abstain rather than inventing a citation or certainty", () => {
  const reply = exampleReply({ id: "missing", name: "Exemplo", resources: [] }, "fora-material");
  expect(reply.text).toBe("Não encontrei isso no material deste concurso");
  expect(reply.missing).toBe(true);
  expect(reply.citation).toBeUndefined();
  expect(reply.url).toBeUndefined();
});