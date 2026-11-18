import { useState } from "react";
import { ArrowRight, BookOpen, FileText, Layers, Scale, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyContext } from "@/components/study-context";
import { questionOrigin, type Resource, type StudyTopic, type QuestionKind } from "@/lib/study-demo";

export function StudyPractice({ topic, resource }: { topic: StudyTopic; resource: Resource }) {
  const { contest, trainingBoard } = useStudyContext();
  const [kind, setKind] = useState<QuestionKind>("inedita");
  const [choice, setChoice] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const official = topic.officialUrl;
  function changeKind(value: QuestionKind) { setKind(value); setChoice(null); setAnswered(false); }
  return <section className="ls-practice" aria-label="Material de estudo" id="study-material">
    <div className="ls-section-heading"><div><span className="ls-eyebrow">MATERIAL DE EXEMPLO</span><h2>{topic.name}</h2></div>
      <span className="ls-bank-label">Banca de treino: {trainingBoard}</span>
    </div>
    {resource === "questoes" && <>
      <div className="ls-question-tabs" aria-label="Origem da questão">
        <Button variant={kind === "anterior" ? "secondary" : "ghost"} aria-pressed={kind === "anterior"} onClick={() => changeKind("anterior")}><FileText />Prova anterior</Button>
        <Button variant={kind === "inedita" ? "secondary" : "ghost"} aria-pressed={kind === "inedita"} onClick={() => changeKind("inedita")}><Sparkles />Questão inédita</Button>
      </div>
      <article className={`ls-question ls-question-${kind}`}>
        <div className="ls-origin">{kind === "anterior" ? <FileText /> : <Sparkles />}<span>{questionOrigin(kind, contest, trainingBoard)}</span></div>
        <p className="ls-origin-disclaimer">{kind === "anterior"
          ? "Enunciado ilustrativo: não foi extraído de uma prova real; órgão, banca e ano demonstram apenas a identificação da origem."
          : "Enunciado ilustrativo preparado para esta prévia; não houve geração automática nem validação do estilo da banca."}</p>
        <h3>{topic.prompt}</h3>
        <div className="ls-answers" role="radiogroup" aria-label="Alternativas">
          {topic.choices?.map((text, index) => <Button key={text} variant="outline" role="radio"
            aria-checked={choice === index} disabled={answered}
            className={`ls-answer${choice === index ? " ls-answer-selected" : ""}${answered && index === topic.correct ? " ls-answer-correct" : ""}`}
            onClick={() => setChoice(index)}><span className="ls-answer-letter">{String.fromCharCode(65 + index)}</span><span>{text}</span></Button>)}
        </div>
        {!answered ? <Button disabled={choice === null} onClick={() => setAnswered(true)}>Responder <ArrowRight /></Button>
          : <div className="ls-foundation" role="status">
            <div className="ls-foundation-heading"><Scale /><strong>{choice === topic.correct ? "Resposta correta neste exemplo." : `Neste exemplo, a alternativa correta é ${String.fromCharCode(65 + (topic.correct ?? 0))}.`}</strong></div>
            <p>{topic.explanation}</p><h4>Fundamento: {topic.article}</h4><blockquote>“{topic.lawText}”</blockquote>
            {official && <a href={official} target="_blank" rel="noopener noreferrer">Conferir no texto oficial <ExternalLink /></a>}
            <Button variant="outline" onClick={() => { setChoice(null); setAnswered(false); }}>Responder novamente</Button>
          </div>}
      </article>
    </>}
    {resource === "resumo" && <article className="ls-reading"><BookOpen /><span className="ls-eyebrow">RESUMO ILUSTRATIVO</span><p>{topic.summary}</p><strong>{topic.article}</strong>
      {official && <a href={official} target="_blank" rel="noopener noreferrer">Ler o texto oficial <ExternalLink /></a>}
    </article>}
    {resource === "flashcards" && <article className="ls-reading"><Layers /><span className="ls-eyebrow">FLASHCARD ILUSTRATIVO</span>
      <h3>{flipped ? topic.flashcard?.back : topic.flashcard?.front}</h3>
      <Button variant="outline" onClick={() => setFlipped(!flipped)}>{flipped ? "Ver pergunta" : "Revelar resposta"}</Button>
      {flipped && <><strong>{topic.article}</strong>{official && <a href={official} target="_blank" rel="noopener noreferrer">Conferir no texto oficial <ExternalLink /></a>}</>}
    </article>}
  </section>;
}