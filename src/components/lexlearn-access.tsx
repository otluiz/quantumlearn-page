import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LexLearnAccess({ mode }: { mode: "cadastro" | "login" }) {
  return (
    <main className="lexpubli lp-dark ll-site ll-access">
      <Link to="/lexlearn" className="ll-brand">
        <BookOpen />
        LexLearn<span>.</span>
      </Link>
      <div className="ll-access-content">
        <LockKeyhole className="ll-access-icon" />
        <span className="ll-kicker">LEXLEARN</span>
        <h1>{mode === "cadastro" ? "Criar sua conta" : "Entrar na sua conta"}</h1>
        <p>
          {mode === "cadastro"
            ? "O cadastro ainda não está disponível nesta prévia."
            : "O acesso por conta ainda não está disponível nesta prévia."}{" "}
          Nenhum dado pessoal será solicitado aqui.
        </p>
        <Button asChild className="ll-primary">
          <Link to="/lexlearn">
            <ArrowLeft />
            Voltar ao LexLearn
          </Link>
        </Button>
      </div>
    </main>
  );
}
