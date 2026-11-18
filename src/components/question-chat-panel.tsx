import { useState } from "react";
import { MessageSquare, Send, X, ExternalLink, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exampleReply, type ExampleReply } from "@/lib/question-review";
import type { StudyTopic } from "@/lib/study-demo";

export function QuestionChatPanel({ topic, contest, onClose, onReport }: {
  topic: StudyTopic; contest: string; onClose: () => void; onReport: () => void;
}) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ question: string; reply: ExampleReply }[]>([]);
  function ask(question: string, mode: "fundamento" | "fora-material") {
    setMessages(previous => [...previous, { question, reply: exampleReply(topic, mode) }]);
    setText("");
  }
  return <aside className="ls-question-chat" aria-label="Pergunte sobre esta questão">
    <div className="ls-panel-heading"><h3><MessageSquare />Pergunte sobre esta questão</h3><Button variant="ghost" size="icon" aria-label="Fechar perguntas" title="Fechar perguntas" onClick={onClose}><X /></Button></div>
    <p className="ls-chat-promise">Responde a partir do texto da lei e do material do seu concurso</p>
    <p className="ls-preview-warning"><strong>EXEMPLO · SEM IA CONECTADA.</strong> Respostas ilustrativas, sem envio de mensagens. Material: {contest} · {topic.name}.</p>
    <div className="ls-chat-suggestions"><Button variant="outline" onClick={() => ask("Qual artigo fundamenta esta resposta?", "fundamento")}>Qual artigo fundamenta esta resposta?</Button><Button variant="outline" onClick={() => ask("O material inclui a jurisprudência mais recente sobre este tema?", "fora-material")}>Pergunta fora do material — exemplo</Button></div>
    <div className="ls-chat-messages" aria-live="polite">{messages.map((message, index) => <div className="ls-chat-exchange" key={index}>
      <p className="ls-chat-question">{message.question}</p><span className="ls-eyebrow">RESPOSTA DE EXEMPLO</span><p>{message.reply.text}</p>
      {message.reply.citation && message.reply.url && <a href={message.reply.url} target="_blank" rel="noopener noreferrer">{message.reply.citation}<ExternalLink /></a>}
      {message.reply.missing && <><p>Não há citação para sustentar uma resposta. Consulte a fonte oficial ou reporte a lacuna.</p><Button variant="outline" onClick={onReport}><Flag />Reportar problema</Button>{topic.officialUrl && <a href={topic.officialUrl} target="_blank" rel="noopener noreferrer">Consultar a fonte oficial — {topic.article}<ExternalLink /></a>}</>}
    </div>)}</div>
    <form onSubmit={event => { event.preventDefault(); if (text.trim()) ask(text.trim(), "fora-material"); }}><label htmlFor="question-chat-input">Sua pergunta de exemplo</label><textarea id="question-chat-input" rows={3} value={text} onChange={event => setText(event.target.value)} /><Button type="submit" disabled={!text.trim()}><Send />Simular pergunta</Button></form>
  </aside>;
}