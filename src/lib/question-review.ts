import type { QuestionKind, StudyTopic } from "@/lib/study-demo";

export const REPORT_TYPES = ["Gabarito errado", "Enunciado ambíguo", "O fundamento não confere com a lei", "Lei desatualizada", "Outro"] as const;
export type ReportType = typeof REPORT_TYPES[number];
export type ReviewStatus = "em revisão" | "confirmada" | "descartada";
export interface QuestionReport {
  id: string;
  questionKey: string;
  question: string;
  origin: string;
  contest: string;
  type: ReportType;
  explanation: string;
  status: ReviewStatus;
  review?: string;
  fixture: boolean;
}
export function validReport(type: string, text: string): boolean {
  return REPORT_TYPES.some(item => item === type) && text.trim().length >= 30;
}
export function questionKey(contestId: string, board: string, topicId: string, kind: QuestionKind): string {
  return [contestId, board, topicId, kind].join(":");
}
export function isQuestionWithdrawn(reports: QuestionReport[], key: string): boolean {
  return reports.some(report => report.questionKey === key && report.status !== "descartada");
}
export const EXAMPLE_REPORTS: QuestionReport[] = [
  { id: "example-confirmed", questionKey: "historical-confirmed", question: "Exemplo histórico: questão sobre prazo previsto em lei", origin: "Questão inédita · exemplo fictício", contest: "Tribunal Regional — concurso de exemplo", type: "Lei desatualizada", explanation: "O prazo apresentado neste exemplo não corresponde ao texto atualizado da lei citada.", status: "confirmada", review: "Revisão fictícia: a referência estava desatualizada. A questão permanece retirada para correção e nova validação.", fixture: true },
  { id: "example-dismissed", questionKey: "historical-dismissed", question: "Exemplo histórico: princípio da eficiência", origin: "Prova anterior · exemplo simulado, FCC, órgão fictício, 2024", contest: "Tribunal Regional — concurso de exemplo", type: "Gabarito errado", explanation: "Gostaria de conferir se a eficiência consta expressamente no dispositivo citado no gabarito.", status: "descartada", review: "Revisão fictícia: o art. 37, caput, da Constituição cita expressamente a eficiência. O gabarito foi mantido.", fixture: true },
];
export interface ExampleReply { text: string; citation?: string; url?: string; missing: boolean; }
export function exampleReply(topic: StudyTopic, mode: "fundamento" | "fora-material"): ExampleReply {
  if (mode === "fora-material" || !topic.article || !topic.lawText || !topic.officialUrl) {
    return { text: "Não encontrei isso no material deste concurso", missing: true };
  }
  return {
    text: `Neste exemplo, a resposta se apoia no trecho: “${topic.lawText}” ${topic.explanation ?? ""}`,
    citation: topic.article + (topic.id === "direitos" ? " · inciso utilizado: II" : " · inciso: não se aplica ao trecho do caput"),
    url: topic.officialUrl,
    missing: false,
  };
}