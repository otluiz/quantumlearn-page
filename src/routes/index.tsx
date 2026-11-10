import { createFileRoute } from "@tanstack/react-router";
import { LexPubliHome, type HomeVariation } from "@/components/lexpubli-home";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { v?: HomeVariation } => ({
    v:
      search.v === "editorial" || search.v === "sinal" || search.v === "vigilia"
        ? search.v
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "LexPubli — O radar de concursos antes do edital" },
      {
        name: "description",
        content:
          "Descubra concursos públicos na autorização, antes do edital. 180 fontes oficiais monitoradas todos os dias. Acompanhe os sinais e comece a estudar com vantagem.",
      },
      { property: "og:title", content: "LexPubli — O radar de concursos antes do edital" },
      {
        property: "og:description",
        content:
          "Quem vê antes, começa antes. Acompanhe concursos da autorização às inscrições e prepare-se com antecedência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
function Home() {
  const { v } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <LexPubliHome
      variation={v ?? "vigilia"}
      onVariation={(variation) =>
        navigate({ search: { v: variation }, replace: true, resetScroll: false })
      }
    />
  );
}
