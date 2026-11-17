import { createFileRoute } from "@tanstack/react-router";
import { LexLearnAccess } from "@/components/lexlearn-access";
import css from "@/styles/lexlearn.css?url";
import accessCss from "@/styles/lexlearn-access.css?url";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — LexLearn" },
      { name: "description", content: "Prévia da recuperação de senha do LexLearn. Nenhum dado é enviado e nenhum e-mail de recuperação é disparado." },
      { property: "og:title", content: "Recuperar senha — LexLearn" },
      { property: "og:description", content: "Conheça a tela de recuperação de acesso à sua preparação no LexLearn, ainda em prévia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: css }, { rel: "stylesheet", href: accessCss }],
  }),
  component: RecuperarSenha,
});

function RecuperarSenha() {
  return <LexLearnAccess mode="recuperar-senha" />;
}