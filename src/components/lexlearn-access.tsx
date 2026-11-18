import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Info, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeButton } from "@/components/theme-toggle";

export function LexLearnAccess({ mode }: { mode: "cadastro" | "login" | "recuperar-senha" }) {
  const recovery = mode === "recuperar-senha";
  const signup = mode === "cadastro";
  const title = signup ? "Criar sua conta" : recovery ? "Recuperar sua senha" : "Entrar na sua conta";
  return (
    <main className="lexpubli ll-site ll-access">
      <header className="ll-access-header">
        <Link to="/lexlearn" className="ll-brand">
          <BookOpen />
          LexLearn<span>.</span>
        </Link>
        <ThemeButton />
      </header>
      <div className="ll-access-content">
        <LockKeyhole className="ll-access-icon" aria-hidden="true" />
        <span className="ll-kicker">SUA PREPARAÇÃO TEM DIREÇÃO.</span>
        <h1>{title}</h1>
        <p className="ll-access-intro">
          {signup ? "Seu concurso é o ponto de partida para o próximo treino."
            : recovery ? "Volte à sua preparação com tranquilidade."
            : "Seu próximo treino começa com foco na sua banca."}
        </p>
        <aside className="ll-preview-notice" id="ll-preview-notice" aria-label="Aviso de prévia">
          <Info aria-hidden="true" />
          <p><strong>Prévia — acesso ainda não disponível.</strong><br />
            Os formulários não enviam nem salvam dados. Não use sua senha real. O envio está desativado.
          </p>
        </aside>
        <form className="ll-access-form" aria-label={title} aria-describedby="ll-preview-notice"
          onSubmit={(event) => event.preventDefault()}>
          {signup && <label className="ll-access-field" htmlFor="access-name">
            Nome
            <input id="access-name" type="text" autoComplete="off" placeholder="Seu nome" />
          </label>}
          <label className="ll-access-field" htmlFor="access-email">
            E-mail
            <input id="access-email" type="email" autoComplete="off" placeholder="seu@email.com" />
          </label>
          {!recovery && <label className="ll-access-field" htmlFor="access-password">
            Senha
            <input id="access-password" type="password" autoComplete="off" placeholder="Use apenas uma senha de exemplo" />
          </label>}
          {signup && <>
            <label className="ll-access-field" htmlFor="access-contest">
              Concurso que vai prestar
              <input id="access-contest" type="text" autoComplete="off" placeholder="Nome do concurso ou órgão" />
            </label>
            <label className="ll-access-consent" htmlFor="access-consent">
              <input id="access-consent" type="checkbox" />
              <span>Li e aceito os termos e a política de privacidade</span>
            </label>
          </>}
          {mode === "login" && <Link to="/recuperar-senha" className="ll-access-link ll-access-forgot">Esqueci minha senha</Link>}
          <Button type="submit" disabled className="ll-primary">
            {signup ? "Criar conta" : recovery ? "Enviar link de recuperação" : "Entrar"}
            <ArrowRight />
          </Button>
        </form>
        <p className="ll-access-switch">
          {signup ? <>Já tem uma conta? <Link to="/login" className="ll-access-link">Entrar</Link></>
            : recovery ? <Link to="/login" className="ll-access-link">Voltar para entrar</Link>
            : <>Ainda não tem uma conta? <Link to="/cadastro" className="ll-access-link">Criar conta</Link></>}
        </p>
        {mode === "login" && <div className="ll-access-preview">
          <p>Quer conhecer a plataforma sem entrar?</p>
          <Button variant="link" className="ll-access-link" asChild>
            <Link to="/app">Explorar / conhecer a prévia <ArrowRight /></Link>
          </Button>
        </div>}
        <Link to="/lexlearn" className="ll-access-link ll-access-back"><ArrowLeft />Voltar ao LexLearn</Link>
      </div>
    </main>
  );
}
