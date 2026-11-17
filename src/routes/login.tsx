import { createFileRoute } from "@tanstack/react-router";
import { LexLearnAccess } from "@/components/lexlearn-access";
import css from "@/styles/lexlearn.css?url";
import accessCss from "@/styles/lexlearn-access.css?url";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — LexLearn" },
      {
        name: "description",
        content: "Disponibilidade do acesso à sua conta LexLearn para preparação para concursos.",
      },
      { property: "og:title", content: "Entrar — LexLearn" },
      {
        property: "og:description",
        content: "Confira a disponibilidade de acesso à sua conta LexLearn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: css }, { rel: "stylesheet", href: accessCss }],
  }),
  component: Login,
});
function Login() {
  return <LexLearnAccess mode="login" />;
}
