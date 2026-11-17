import { createFileRoute } from "@tanstack/react-router";
import { LexLearnAccess } from "@/components/lexlearn-access";
import css from "@/styles/lexlearn.css?url";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — LexLearn" },
      {
        name: "description",
        content: "Disponibilidade do cadastro no LexLearn para preparação direcionada a concursos.",
      },
      { property: "og:title", content: "Criar conta — LexLearn" },
      {
        property: "og:description",
        content: "Prepare-se com foco na sua banca. Confira a disponibilidade de criação de conta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: css }],
  }),
  component: Cadastro,
});
function Cadastro() {
  return <LexLearnAccess mode="cadastro" />;
}
