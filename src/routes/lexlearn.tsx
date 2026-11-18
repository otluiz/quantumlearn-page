import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeButton } from "@/components/theme-toggle";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  ListChecks,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dawn from "@/assets/lexpubli-dawn.jpg";
import css from "@/styles/lexlearn.css?url";

export const Route = createFileRoute("/lexlearn")({
  head: () => ({
    meta: [
      { title: "LexLearn — Treine com a banca da sua prova" },
      {
        name: "description",
        content:
          "Sua prova tem data. Prepare-se com provas anteriores da banca, questões inéditas no estilo dela e gabaritos ancorados no texto oficial da lei.",
      },
      { property: "og:title", content: "LexLearn — Sua prova tem data. Treine com a sua banca." },
      {
        property: "og:description",
        content:
          "Preparação direcionada à banca, fundamento na legislação oficial e transparência sobre a cobertura do edital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://quantumlearn-page.lovable.app/lexlearn" },
    ],
    links: [
      { rel: "stylesheet", href: css },
      { rel: "canonical", href: "https://quantumlearn-page.lovable.app/lexlearn" },
    ],
  }),
  component: LexLearnLanding,
});

function LexLearnLanding() {
  return (
    <div className="lexpubli ll-site">
      <header className="ll-wrap ll-header">
        <Link to="/lexlearn" className="ll-brand">
          <BookOpen />
          LexLearn<span>.</span>
        </Link>
        <nav aria-label="Navegação LexLearn">
          <Button
            variant="ghost"
            onClick={() =>
              document.getElementById("ll-como")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Como funciona
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              document.getElementById("ll-cobertura")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Cobertura do edital
          </Button>
        </nav>
        <div className="ll-actions">
          <ThemeButton />
          <Button className="ll-primary" asChild>
            <Link to="/cadastro">
              Criar conta <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>
      <main>
        <section className="ll-hero">
          <img
            className="ll-hero-image"
            src={dawn}
            width={1920}
            height={1024}
            alt="Congresso Nacional em Brasília ao amanhecer"
          />
          <div className="ll-hero-shade" />
          <div className="ll-hero-grid" aria-hidden="true" />
          <div className="ll-wrap">
            <div className="ll-hero-body">
              <span className="ll-kicker">CONCURSO ESCOLHIDO. PREPARAÇÃO DIRECIONADA.</span>
              <h1>
                Sua prova tem data.
                <br />
                Treine com a banca
                <br />
                <em>que vai te avaliar.</em>
              </h1>
              <p>
                Você já se inscreveu. Agora, transforme o tempo até a prova em treino focado:
                questões da sua banca, prática no estilo dela e respostas com fundamento na lei.
              </p>
              <div className="ll-actions">
                <Button className="ll-primary" asChild>
                  <Link to="/cadastro">
                    Criar conta <ArrowRight />
                  </Link>
                </Button>
                <Button className="ll-outline" variant="outline" asChild>
                  <Link to="/login">
                    Entrar <ArrowUpRight />
                  </Link>
                </Button>
              </div>
              <div className="ll-hero-note">
                <ShieldCheck />A resposta começa no texto oficial.
              </div>
            </div>
          </div>
          <div className="ll-hero-bottom">
            <div className="ll-wrap">
              <span>
                <Target />
                Da inscrição à prova. Estudo com direção.
              </span>
              <Link to="/" search={{ v: "sinal" }}>
                Ainda procurando um concurso? LexPubli ↗
              </Link>
            </div>
          </div>
        </section>
        <section className="ll-section ll-wrap" id="ll-como">
          <div className="ll-heading">
            <div>
              <span className="ll-kicker">UM CAMINHO CLARO ATÉ A PROVA</span>
              <h2>
                Não estude no escuro.
                <br />
                <em>Treine com direção.</em>
              </h2>
            </div>
            <p>
              Seu concurso define o destino. A banca orienta o treino. O edital delimita o que
              estudar.
            </p>
          </div>
          <div className="ll-steps">
            {[
              {
                icon: Target,
                title: "Escolha seu concurso",
                text: "Parta da prova para a qual você se inscreveu. Organize seu estudo a partir do edital e da banca responsável.",
              },
              {
                icon: FileText,
                title: "Treine com provas anteriores da banca",
                text: "Conheça a forma de perguntar, o nível de exigência e os temas que aparecem nas provas anteriores.",
              },
              {
                icon: ListChecks,
                title: "Pratique com questões inéditas no estilo dela",
                text: "Aplique o que aprendeu em novas questões, mantendo o foco na linguagem e no formato da sua banca.",
              },
            ].map((step) => (
              <article key={step.title}>
                <div className="ll-step-icon">
                  <step.icon />
                  <ArrowRight />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="ll-section ll-anchor">
          <div className="ll-wrap ll-anchor-layout">
            <div className="ll-anchor-copy">
              <span className="ll-kicker">A LEI COMO PONTO DE PARTIDA</span>
              <h2>
                Gabarito com fundamento.
                <br />
                <em>Não com opinião.</em>
              </h2>
              <p>
                O gabarito é ancorado no texto oficial da lei, e não na opinião de um professor. A
                explicação aponta o fundamento para você conferir a resposta na fonte — e entender
                por que ela está correta.
              </p>
              <a
                href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar a Constituição no Planalto <ArrowUpRight />
              </a>
            </div>
            <article className="ll-law">
              <span className="ll-example">EXEMPLO ILUSTRATIVO · NÃO É QUESTÃO DE BANCA</span>
              <p className="ll-law-question">
                A eficiência está expressamente entre os princípios da administração pública na
                Constituição?
              </p>
              <div className="ll-law-answer">
                <CheckCircle2 />
                <span>
                  <strong>Sim. O fundamento está na Constituição.</strong>
                  <br />A resposta pode ser conferida no texto oficial:
                </span>
              </div>
              <blockquote>
                “legalidade, impessoalidade, moralidade, publicidade e eficiência”
              </blockquote>
              <p className="ll-law-source">
                Constituição Federal · Da Administração Pública
                <br />
                Trecho do texto oficial, disponível no Planalto.
              </p>
            </article>
          </div>
        </section>
        <section id="ll-cobertura" className="ll-section ll-wrap">
          <div className="ll-coverage-intro">
            <span className="ll-kicker">TRANSPARÊNCIA TAMBÉM É PREPARAÇÃO</span>
            <h2>
              Saiba o que cobrimos.
              <br />
              <em>E o que ainda falta.</em>
            </h2>
            <p>
              Não basta dizer que o edital está coberto. Você precisa conhecer os tópicos
              disponíveis e as lacunas para completar sua preparação.
            </p>
            <span className="ll-example">EXEMPLO ILUSTRATIVO · EDITAL FICTÍCIO</span>
          </div>
          <div className="ll-coverage-grid">
            <div className="ll-coverage-stat">
              <strong>X%</strong>
              <p>
                “Cobrimos X% dos tópicos do edital.”
                <br />
                <strong className="ll-example">EXEMPLO — PERCENTUAL NÃO CALCULADO</strong>
              </p>
            </div>
            <div>
              <h3>Disponíveis neste exemplo</h3>
              <ul>
                <li>
                  <Check />
                  Princípios da administração pública
                </li>
                <li>
                  <Check />
                  Direitos e garantias fundamentais
                </li>
                <li>
                  <Check />
                  Organização do Estado
                </li>
              </ul>
            </div>
            <div className="ll-missing">
              <h3>O que falta neste exemplo</h3>
              <ul>
                <li>
                  <X />
                  Legislação específica do órgão
                </li>
                <li>
                  <X />
                  Regimento interno
                </li>
                <li>
                  <X />
                  Atualidades previstas no edital
                </li>
              </ul>
            </div>
          </div>
          <p className="ll-coverage-note">
            Esta lista é fictícia e não representa a cobertura de um concurso real. O “X%” é apenas
            um marcador de exemplo, não uma medida de desempenho.
          </p>
        </section>
        <section className="ll-final">
          <div className="ll-wrap">
            <div>
              <span className="ll-kicker">SUA INSCRIÇÃO JÁ FOI O PRIMEIRO PASSO.</span>
              <h2>
                Agora, faça do treino
                <br />
                <em>o próximo.</em>
              </h2>
            </div>
            <div className="ll-actions">
              <Button className="ll-primary" asChild>
                <Link to="/cadastro">
                  Criar conta <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" className="ll-outline" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="ll-wrap ll-footer">
        <div>
          <Link to="/lexlearn" className="ll-brand">
            <BookOpen />
            LexLearn<span>.</span>
          </Link>
          <p>Preparação com direção. Respostas com fundamento.</p>
        </div>
        <Link to="/" search={{ v: "sinal" }}>
          Descubra concursos antes do edital <ArrowUpRight />
        </Link>
      </footer>
    </div>
  );
}
