import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useStudyContext } from "@/components/study-context";
import { DEMO_CONTESTS, DEMO_BOARDS } from "@/lib/study-demo";
import { validDailyGoal } from "@/lib/study-tools";
import toolsCss from "@/styles/study-tools.css?url";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    links: [{ rel: "stylesheet", href: toolsCss }],
    meta: [
      { title: "Configurações — LexLearn" },
      {
        name: "description",
        content: "Gerencie suas preferências de estudo, aparência e perfil no LexLearn.",
      },
      { property: "og:title", content: "Configurações — LexLearn" },
      {
        property: "og:description",
        content: "Gerencie suas preferências de estudo, aparência e perfil no LexLearn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const context = useStudyContext();
  const { contest, followedIds, followContest, unfollowContest, extraBoard, setExtraBoard, dailyGoal, setDailyGoal, alerts, setAlerts, reports, reviews, clearDemoData } = context;
  const [goal, setGoal] = useState(String(dailyGoal));
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  function downloadExample() {
    const data = { aviso: "Dados de exemplo desta sessão. Nenhuma conta real conectada.", concursoAtivo: contest.name, concursos: followedIds, bancaAdicional: extraBoard, metaDiariaMinutos: dailyGoal, avisos: alerts, marcacoes: reports, revisoes: reviews };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href=url; link.download="lexlearn-dados-de-exemplo.json"; link.click(); window.setTimeout(() => URL.revokeObjectURL(url),1000);
    setMessage("Arquivo de exemplo baixado. Não contém dados de uma conta real.");
  }
  return <div className="ls-study"><span className="ls-eyebrow">PREFERÊNCIAS · PRÉVIA</span><h1>Configurações do seu estudo</h1><p className="ls-study-intro">Concurso ativo: {contest.name}.</p><p className="ls-tools-status">Ajustes apenas nesta sessão. Nenhum e-mail é enviado; baixar ou apagar atua somente nos dados desta demonstração.</p>
    <section className="ls-tools-section"><h2>Concursos acompanhados</h2><p>Adicione ou remova concursos do catálogo de exemplo. Mantenha ao menos um concurso para orientar seu estudo.</p>{DEMO_CONTESTS.map(c => <div className="ls-followed-item" key={c.id}><div><h3>{c.name}</h3><p>{c.role} · {c.board}{c.id === contest.id ? " · ativo" : ""}</p></div>{followedIds.includes(c.id) ? <Button variant="outline" size="icon" aria-label={`Remover ${c.name}`} title={`Remover ${c.name}`} disabled={followedIds.length===1} onClick={() => { unfollowContest(c.id); setMessage("Concurso removido da lista desta sessão."); }}><Trash2 /></Button> : <Button variant="outline" onClick={() => { followContest(c.id); setMessage("Concurso de exemplo adicionado nesta sessão."); }}><Plus />Adicionar</Button>}</div>)}</section>
    <section className="ls-tools-section"><h2>Banca de treino</h2><p>Banca do concurso: {contest.board}. A escolha adicional não muda o edital.</p><label className="ls-tools-field">Estilo de treino<select value={extraBoard ?? "padrao"} onChange={e => setExtraBoard(e.target.value === "padrao" ? null : e.target.value)}><option value="padrao">Banca do concurso — {contest.board}</option>{DEMO_BOARDS.filter(b => b!==contest.board).map(b => <option key={b} value={b}>Treinar também com {b}</option>)}</select></label></section>
    <section className="ls-tools-section"><h2>Meta diária de estudo</h2><p>Preferência de exemplo: {dailyGoal} minutos por dia. Não representa tempo já estudado.</p><form onSubmit={e => { e.preventDefault(); if(validDailyGoal(Number(goal))) { setDailyGoal(Number(goal)); setMessage("Meta diária atualizada apenas nesta sessão."); } }}><label className="ls-tools-field">Minutos por dia<input type="number" min={5} max={240} step={5} value={goal} onChange={e => setGoal(e.target.value)} /></label><Button type="submit" disabled={!validDailyGoal(Number(goal))}>Aplicar meta na prévia</Button></form></section>
    <section className="ls-tools-section"><h2>Avisos por e-mail</h2><p>Preferências simuladas para os concursos acompanhados. Envio de e-mail não conectado.</p><div className="ls-settings-toggle"><label htmlFor="exam-alert">Provas chegando</label><Checkbox id="exam-alert" checked={alerts.exam} onCheckedChange={v => setAlerts({ ...alerts, exam: v === true })} /></div><div className="ls-settings-toggle"><label htmlFor="notice-alert">Edital publicado</label><Checkbox id="notice-alert" checked={alerts.notice} onCheckedChange={v => setAlerts({ ...alerts, notice: v === true })} /></div></section>
    <section className="ls-tools-section"><h2>Privacidade</h2><p>Não há conta real conectada. Estas ações não baixam nem apagam dados pessoais mantidos em outros serviços.</p><div className="ls-tools-actions"><Button variant="outline" onClick={downloadExample}><Download />Baixar meus dados — exemplo</Button><Button variant="outline" onClick={() => setConfirmDelete(true)}><Trash2 />Apagar meus dados — exemplo</Button></div>{confirmDelete && <div className="ls-danger-confirm"><p className="ls-tools-note">Apagar as marcações e revisões desta sessão e restaurar as preferências de exemplo? Esta ação não exclui uma conta real.</p><div className="ls-tools-actions"><Button onClick={() => { clearDemoData(); setGoal("30"); setConfirmDelete(false); setMessage("Marcações e revisões locais apagadas; preferências de exemplo restauradas. Nenhuma conta real foi excluída."); }}>Confirmar exclusão local</Button><Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancelar</Button></div></div>}</section>
    {message && <p role="status" className="ls-tools-status">{message}</p>}
  </div>;
}
