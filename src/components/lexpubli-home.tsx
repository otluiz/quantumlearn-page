import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  Landmark,
  Menu,
  Moon,
  Radio,
  Radar,
  Search,
  ShieldCheck,
  Sun,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dawn from "@/assets/lexpubli-dawn.jpg";

export type HomeVariation = "vigilia" | "editorial" | "sinal";
const stages = [
  {
    title: "Autorizado",
    text: "O primeiro sinal oficial. É aqui que a sua preparação começa.",
    icon: Radio,
  },
  {
    title: "Banca definida",
    text: "A organizadora foi escolhida. Direcione seu estudo ao estilo da prova.",
    icon: Landmark,
  },
  {
    title: "Edital publicado",
    text: "Regras, conteúdo e datas confirmados. Ajuste a sua rota.",
    icon: FileCheck2,
  },
  {
    title: "Inscrições abertas",
    text: "Chegou a hora de garantir sua participação. Não perca o prazo.",
    icon: Check,
  },
];
const examples = [
  {
    name: "Banco Central",
    initials: "BC",
    area: "Bancária",
    stage: "Autorizado",
    description: "Auditor, técnico e procurador",
    vacancies: "170 vagas autorizadas",
    date: "03 jul 2026",
    reference: "Portaria MGI nº 5.508/2026",
    source: "https://www.direcaoconcursos.com.br/noticias/concurso-bacen-autorizado-170-vagas",
  },
  {
    name: "Receita Federal",
    initials: "RF",
    area: "Fiscal",
    stage: "Autorizado",
    description: "Auditor-fiscal e analista tributário",
    vacancies: "146 vagas autorizadas",
    date: "03 jul 2026",
    reference: "Autorização publicada no DOU",
    source:
      "https://g1.globo.com/trabalho-e-carreira/concursos/noticia/2026/07/06/governo-autoriza-concursos-da-receita-federal-e-banco-central.ghtml",
  },
  {
    name: "Controladoria-Geral da União",
    initials: "CGU",
    area: "Controle",
    stage: "Banca definida",
    description: "Auditor federal de finanças e controle",
    vacancies: "60 vagas autorizadas",
    date: "22 jun 2026",
    reference: "Autorização noticiada em outubro de 2026",
    source:
      "https://www.jusconsulta.com.br/noticias/governo-autoriza-concursos-no-bc-cgu-anpd-e-receita-ate-inicio-de-2027",
  },
];

function Brand() {
  return (
    <span className="lp-brand">
      <span className="lp-brand-symbol">
        <Radar aria-hidden="true" />
      </span>
      <span>
        Lex<span className="lp-brand-publi">Publi</span>
        <span className="lp-brand-dot">.</span>
      </span>
    </span>
  );
}
function scrollToRadar() {
  document
    .getElementById("radar")
    ?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
}

export function LexPubliHome({
  variation,
  onVariation,
}: {
  variation: HomeVariation;
  onVariation: (v: HomeVariation) => void;
}) {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [followed, setFollowed] = useState<string[]>([]);
  const visible = examples.filter(
    (item) =>
      (filter === "Todos" || item.stage === filter) &&
      `${item.name} ${item.area}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
  function toggleFollow(name: string) {
    setFollowed((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }
  return (
    <div className={`lexpubli lp-${variation}${dark ? " lp-dark" : ""}`}>
      <div className="lp-concept-bar">
        <div className="lp-container lp-concept-inner">
          <span className="lp-concept-label">UM PASSO ANTES DO EDITAL</span>
          <div className="lp-variation-controls" role="group" aria-label="Variações da home">
            {(["vigilia", "editorial", "sinal"] as const).map((v, i) => (
              <Button
                key={v}
                variant="ghost"
                aria-pressed={variation === v}
                onClick={() => onVariation(v)}
                className={variation === v ? "lp-variation-active" : ""}
              >
                <span>0{i + 1}</span>{" "}
                {v === "vigilia" ? "Vigília" : v === "editorial" ? "Editorial" : "Sinal"}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <header className="lp-header">
        <div className="lp-container lp-header-inner">
          <a href="/" aria-label="LexPubli — início">
            <Brand />
          </a>
          <nav aria-label="Navegação principal" className="lp-nav">
            <Button variant="ghost" onClick={scrollToRadar}>
              Radar de concursos
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Como funciona
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/app">
                LexLearn <ArrowUpRight />
              </Link>
            </Button>
          </nav>
          <div className="lp-header-actions">
            <Button
              variant="ghost"
              size="icon"
              title={dark ? "Usar tema claro" : "Usar tema escuro"}
              aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
            <Button className="lp-cta lp-header-cta" onClick={scrollToRadar}>
              Acompanhar um concurso <ArrowRight />
            </Button>
            <Button
              className="lp-mobile-menu"
              variant="ghost"
              size="icon"
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menu && (
          <nav className="lp-mobile-nav" aria-label="Navegação móvel">
            <Button
              variant="ghost"
              onClick={() => {
                scrollToRadar();
                setMenu(false);
              }}
            >
              Radar de concursos
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                document.getElementById("como-funciona")?.scrollIntoView();
                setMenu(false);
              }}
            >
              Como funciona
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/app">
                Estudar no LexLearn <ArrowUpRight />
              </Link>
            </Button>
          </nav>
        )}
      </header>
      <main>
        <section className="lp-hero" aria-labelledby="hero-heading">
          <img
            src={dawn}
            className="lp-dawn"
            width={1920}
            height={1024}
            alt="Congresso Nacional em Brasília, iluminado antes do amanhecer"
          />
          <div className="lp-hero-shade" />
          <div className="lp-radar-art" aria-hidden="true">
            <div className="lp-radar-cross" />
            <div className="lp-radar-ring ring-1" />
            <div className="lp-radar-ring ring-2" />
            <div className="lp-radar-ring ring-3" />
            <div className="lp-radar-sweep" />
            <span className="lp-radar-point point-1" />
            <span className="lp-radar-point point-2" />
            <span className="lp-radar-point point-3" />
            <span className="lp-signal-label">
              <Radio /> PRIMEIRO SINAL CAPTADO
            </span>
            <span className="lp-radar-coordinate">15°47′ S · 47°52′ O</span>
          </div>
          <div className="lp-container lp-hero-content">
            <div className="lp-eyebrow">
              <span className="lp-live-dot" /> ANTECIPE O SEU PRÓXIMO PASSO
            </div>
            <h1 id="hero-heading">
              O radar de concursos
              <br />
              <em>antes do edital.</em>
            </h1>
            <p>
              Quando o edital sai, a corrida já começou.
              <br className="lp-desktop-break" /> Descubra o concurso na autorização — e ganhe
              <br className="lp-desktop-break" /> meses para chegar mais preparado.
            </p>
            <div className="lp-hero-actions">
              <Button className="lp-cta" size="lg" onClick={scrollToRadar}>
                Acompanhar um concurso <ArrowRight />
              </Button>
              <Button variant="ghost" className="lp-hero-secondary" asChild>
                <Link to="/app">
                  <BookOpen /> Estudar no LexLearn <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="lp-hero-proof">
              <ShieldCheck /> Informação oficial. Antecedência de verdade.
            </div>
          </div>
          <div className="lp-hero-bottom">
            <div className="lp-container">
              <span>
                <span className="lp-live-dot" /> 180 fontes oficiais no nosso campo de visão
              </span>
              <Button
                variant="ghost"
                onClick={() =>
                  document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                A vantagem começa aqui <ChevronDown />
              </Button>
            </div>
          </div>
        </section>
        <section id="como-funciona" className="lp-section lp-cycle">
          <div className="lp-container">
            <div className="lp-section-heading">
              <div>
                <span className="lp-kicker">DO PRIMEIRO SINAL À SUA INSCRIÇÃO</span>
                <h2>
                  Todo concurso tem um caminho.
                  <br />
                  <em>Você não precisa entrar no final.</em>
                </h2>
              </div>
              <p>
                O LexPubli acompanha cada etapa.
                <br />
                Você sabe onde está — e o que vem depois.
              </p>
            </div>
            <ol className="lp-steps">
              {stages.map((step, i) => (
                <li key={step.title} className={i === 0 ? "lp-step-first" : ""}>
                  <div className="lp-step-line">
                    <span className="lp-step-icon">
                      <step.icon />
                    </span>
                    <span className="lp-step-number">0{i + 1}</span>
                    {i !== 3 && <ArrowRight className="lp-step-arrow" />}
                  </div>
                  <h3>
                    {step.title}
                    {i === 0 && <span className="lp-early-label">VOCÊ CHEGA AQUI</span>}
                  </h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="lp-numbers">
          <div className="lp-container lp-numbers-grid">
            <div>
              <span className="lp-kicker">NÃO É ACHISMO. É MONITORAMENTO.</span>
              <h2>
                Olhos atentos.
                <br />
                <em>Todos os dias.</em>
              </h2>
            </div>
            <div className="lp-number">
              <strong>
                180<span> fontes</span>
              </strong>
              <p>
                oficiais monitoradas
                <br />
                automaticamente, todos os dias
              </p>
            </div>
            <div className="lp-number">
              <strong>10.529</strong>
              <p>
                publicações do PNCP lidas
                <br />
                em uma única varredura
              </p>
            </div>
            <div className="lp-number">
              <strong>
                4<span> etapas</span>
              </strong>
              <p>
                acompanhadas da autorização
                <br />à abertura das inscrições
              </p>
            </div>
          </div>
        </section>
        <section id="radar" className="lp-section lp-demo">
          <div className="lp-container">
            <div className="lp-section-heading">
              <div>
                <span className="lp-kicker">
                  <Radio /> NO CAMPO DO RADAR
                </span>
                <h2>
                  O próximo concurso.
                  <br />
                  <em>O seu próximo passo.</em>
                </h2>
              </div>
              <div className="lp-radar-heading-note">
                <span className="lp-live-dot" /> Sinais antes do edital
              </div>
            </div>
            <div className="lp-demo-note">
              <ShieldCheck />
              <p>
                Demonstração com autorizações de 2026. As etapas abaixo retratam os registros
                citados, não o andamento atual. Acompanhamentos nesta prévia duram apenas esta
                visita.
              </p>
            </div>
            <div className="lp-radar-toolbar">
              <div className="lp-filters" role="group" aria-label="Filtrar concursos por etapa">
                {["Todos", "Autorizado", "Banca definida"].map((f) => (
                  <Button
                    key={f}
                    variant="ghost"
                    aria-pressed={filter === f}
                    className={filter === f ? "lp-filter-active" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f === "Todos"
                      ? "Todos os sinais"
                      : f === "Autorizado"
                        ? "Autorizados"
                        : "Banca definida"}
                    {f === "Autorizado" && <span className="lp-filter-dot" />}
                  </Button>
                ))}
              </div>
              <label className="lp-search">
                <Search />
                <input
                  aria-label="Buscar concurso"
                  placeholder="Buscar órgão ou área"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="lp-contest-grid">
              {visible.map((item) => (
                <article className="lp-contest" key={item.name}>
                  <div className="lp-contest-top">
                    <span className="lp-org-icon">
                      <Landmark />
                    </span>
                    <span
                      className={`lp-status ${item.stage === "Autorizado" ? "lp-status-early" : ""}`}
                    >
                      <span />
                      {item.stage}
                    </span>
                  </div>
                  <div className="lp-contest-body">
                    <span className="lp-contest-area">FEDERAL · {item.area.toUpperCase()}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="lp-vacancies">
                      <Target />
                      {item.vacancies}
                    </div>
                  </div>
                  <div className="lp-contest-reference">
                    <Radio />
                    <span>
                      Autorização: {item.date}
                      <small>{item.reference}</small>
                    </span>
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consultar referência da autorização de ${item.name}`}
                      title="Consultar referência"
                    >
                      <ArrowUpRight />
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    className={`lp-follow ${followed.includes(item.name) ? "lp-follow-active" : ""}`}
                    aria-pressed={followed.includes(item.name)}
                    onClick={() => toggleFollow(item.name)}
                  >
                    {followed.includes(item.name) ? <Check /> : <Bell />}
                    {followed.includes(item.name)
                      ? "Acompanhando nesta prévia"
                      : "Acompanhar concurso"}
                    {!followed.includes(item.name) && <ArrowRight />}
                  </Button>
                </article>
              ))}
            </div>
            {visible.length === 0 && (
              <div className="lp-empty">
                <Search />
                <h3>Nenhum sinal encontrado</h3>
                <p>Tente outro órgão ou selecione todas as etapas.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setFilter("Todos");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
            <p className="lp-radar-footnote">
              PNCP: Portal Nacional de Contratações Públicas. Referências de cada autorização
              disponíveis nos cartões.
            </p>
          </div>
        </section>
        <section className="lp-section lp-benefits">
          <div className="lp-container">
            <span className="lp-kicker">ANTECEDÊNCIA MUDA O JOGO</span>
            <h2>
              Menos correria.
              <br />
              <em>Mais preparação.</em>
            </h2>
            <div className="lp-benefit-grid">
              {[
                {
                  icon: Clock3,
                  title: "Tempo a seu favor",
                  text: "Comece enquanto outros ainda esperam o edital. Construa uma base sólida, sem estudar contra o relógio.",
                },
                {
                  icon: ShieldCheck,
                  title: "Sinais, não rumores",
                  text: "Autorizações e movimentações com referência. Mais clareza para decidir onde investir seu esforço.",
                },
                {
                  icon: BookOpen,
                  title: "Da descoberta ao estudo",
                  text: "Encontrou seu concurso? No LexLearn, transforme a legislação do edital em quiz e flashcards.",
                },
              ].map((item) => (
                <div className="lp-benefit" key={item.title}>
                  <item.icon />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.title === "Da descoberta ao estudo" && (
                    <Button variant="link" asChild>
                      <Link to="/app">
                        Conhecer o LexLearn <ArrowUpRight />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="lp-final">
          <div className="lp-container">
            <div>
              <span className="lp-kicker">QUEM VÊ ANTES, COMEÇA ANTES.</span>
              <h2>
                Seu futuro não precisa
                <br />
                esperar <em>o edital.</em>
              </h2>
              <p>Encontre seu concurso. Acompanhe os sinais. Comece com vantagem.</p>
            </div>
            <Button className="lp-cta" size="lg" onClick={scrollToRadar}>
              Acompanhar um concurso <ArrowRight />
            </Button>
          </div>
        </section>
      </main>
      <footer className="lp-footer">
        <div className="lp-container lp-footer-top">
          <div>
            <Brand />
            <p>Informação antes. Preparação melhor.</p>
          </div>
          <div className="lp-footer-links">
            <Button variant="ghost" onClick={scrollToRadar}>
              Radar de concursos
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/app">
                LexLearn <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <span className="lp-footer-made">
            Feito para quem se prepara.
            <br />
            <span>Feito no Brasil.</span>
          </span>
        </div>
        <div className="lp-container lp-footer-bottom">
          <span>© 2026 LexPubli. Todos os direitos reservados.</span>
          <span>Fontes oficiais. Olhar atento.</span>
        </div>
      </footer>
    </div>
  );
}
