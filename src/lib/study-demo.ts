/** Presentation-only fixtures. Not an official syllabus, past paper or student record. */
export type Resource = "questoes" | "resumo" | "flashcards";
export type QuestionKind = "anterior" | "inedita";
export interface StudyTopic {
  id: string;
  name: string;
  resources: Resource[];
  prompt?: string;
  choices?: string[];
  correct?: number;
  article?: string;
  lawText?: string;
  officialUrl?: string;
  explanation?: string;
  summary?: string;
  flashcard?: { front: string; back: string };
}
export interface DemoContest {
  id: string;
  name: string;
  role: string;
  board: string;
  examDate: string;
  disciplines: { name: string; topics: StudyTopic[] }[];
}

const principles: StudyTopic = {
  id: "principios", name: "Princípios da administração pública",
  resources: ["questoes", "resumo", "flashcards"],
  prompt: "Qual princípio está expressamente previsto no caput do art. 37 da Constituição Federal?",
  choices: ["Eficiência", "Supremacia do interesse público", "Razoabilidade", "Continuidade do serviço público"],
  correct: 0, article: "Constituição Federal · art. 37, caput",
  lawText: "A administração pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência […]",
  officialUrl: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art37",
  explanation: "Eficiência aparece expressamente no caput. A questão pede um princípio expresso, não a inexistência de outros princípios no direito administrativo.",
  summary: "O caput do art. 37 enumera legalidade, impessoalidade, moralidade, publicidade e eficiência. Esses princípios orientam a administração direta e indireta de todos os Poderes e entes federativos.",
  flashcard: { front: "Quais princípios estão expressos no caput do art. 37?", back: "Legalidade, impessoalidade, moralidade, publicidade e eficiência." },
};
const rights: StudyTopic = {
  id: "direitos", name: "Direitos e garantias fundamentais", resources: ["questoes", "flashcards"],
  prompt: "Segundo o art. 5º, II, da Constituição, quando alguém pode ser obrigado a fazer ou deixar de fazer alguma coisa?",
  choices: ["Quando houver recomendação de autoridade", "Em virtude de lei", "Por costume administrativo", "Sempre que houver interesse particular"],
  correct: 1, article: "Constituição Federal · art. 5º, II",
  lawText: "ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei;",
  officialUrl: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art5",
  explanation: "O inciso II estabelece a reserva de lei para impor essa obrigação. Uma recomendação ou um costume, isoladamente, não satisfaz o texto citado.",
  flashcard: { front: "O que estabelece o art. 5º, II?", back: "Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei." },
};
const stability: StudyTopic = {
  id: "estabilidade", name: "Estabilidade do servidor", resources: ["questoes", "resumo"],
  prompt: "Qual período de efetivo exercício o art. 41 da Constituição exige para a estabilidade do servidor nomeado para cargo efetivo em virtude de concurso público?",
  choices: ["Um ano", "Dois anos", "Três anos", "Cinco anos"], correct: 2,
  article: "Constituição Federal · art. 41, caput e § 4º",
  lawText: "São estáveis após três anos de efetivo exercício os servidores nomeados para cargo de provimento efetivo em virtude de concurso público.",
  officialUrl: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art41",
  explanation: "O caput prevê três anos. Além do período, o § 4º exige avaliação especial de desempenho por comissão instituída para essa finalidade.",
  summary: "A estabilidade exige nomeação para cargo efetivo em virtude de concurso, três anos de efetivo exercício e avaliação especial de desempenho. Não se confunde com simples permanência em qualquer cargo público.",
};

export const DEMO_CONTESTS: DemoContest[] = [
  { id: "tribunal", name: "Tribunal Regional — concurso de exemplo", role: "Técnico judiciário", board: "FCC", examDate: "2026-12-19",
    disciplines: [
      { name: "Direito Constitucional", topics: [rights, { id: "estado", name: "Organização do Estado", resources: [] }] },
      { name: "Direito Administrativo", topics: [principles, stability] },
      { name: "Língua Portuguesa", topics: [{ id: "interpretacao", name: "Interpretação de textos", resources: [] }] },
      { name: "Legislação específica", topics: [{ id: "regimento", name: "Regimento interno do órgão", resources: [] }] },
    ] },
  { id: "prefeitura", name: "Prefeitura Municipal — concurso de exemplo", role: "Analista administrativo", board: "FGV", examDate: "2027-01-24",
    disciplines: [
      { name: "Direito Administrativo", topics: [principles, stability] },
      { name: "Direito Constitucional", topics: [rights] },
      { name: "Legislação municipal", topics: [{ id: "lei-organica", name: "Lei orgânica do município", resources: [] }] },
      { name: "Raciocínio lógico", topics: [{ id: "logica", name: "Proposições e conectivos", resources: [] }] },
    ] },
];
export const DEMO_BOARDS = ["FCC", "FGV", "Cebraspe", "Vunesp"];
export const DEMO_REFERENCE_DATE = "2026-11-17";

export function daysUntilExam(examDate: string, today: string): number {
  return Math.ceil((Date.parse(examDate + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000);
}
export function countdownLabel(days: number): string {
  if (days < 0) return "Data de exemplo já passou";
  if (days === 0) return "A prova de exemplo é hoje";
  return days === 1 ? "Falta 1 dia" : `Faltam ${days} dias`;
}
export function resolveTrainingBoard(contest: DemoContest, extraBoard: string | null): string {
  return extraBoard && extraBoard !== contest.board ? extraBoard : contest.board;
}
export function questionOrigin(kind: QuestionKind, contest: DemoContest, board: string): string {
  return kind === "anterior"
    ? `Prova anterior — ${board}, ${contest.name}, 2024 (exemplo simulado)`
    : `Questão inédita no estilo da banca ${board}, gerada para o concurso ${contest.name} (exemplo simulado)`;
}