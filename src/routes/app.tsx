import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeButton } from "@/components/theme-toggle";
import { StudyProvider, useStudyContext } from "@/components/study-context";
import { ActiveContest } from "@/components/active-contest";
import workspaceCss from "@/styles/lexlearn-workspace.css?url";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Área de estudos — LexLearn" },
      { name: "description", content: "Preparação orientada ao concurso, com edital e banca de treino em demonstração." },
      { property: "og:title", content: "Área de estudos — LexLearn" },
      { property: "og:description", content: "Seu concurso no centro da preparação. Área de estudos LexLearn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "stylesheet", href: workspaceCss }],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <StudyProvider>
    <SidebarProvider defaultOpen className="lexpubli ll-workspace">
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="ls-app-header">
            <div><SidebarTrigger className="text-muted-foreground hover:text-foreground" aria-label="Abrir ou fechar menu" /><span>LexLearn · Área de estudos</span></div>
            <TrainingBoardIndicator />
            <ThemeButton />
          </header>
          <ActiveContest />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
    </StudyProvider>
  );
}

function TrainingBoardIndicator() {
  const { extraBoard, trainingBoard } = useStudyContext();
  return extraBoard ? <strong className="ls-sticky-board" role="status">Treino adicional: {trainingBoard}</strong> : null;
}
