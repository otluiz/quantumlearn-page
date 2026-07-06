import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, Search } from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Nexlearn — Workspace" },
      { name: "description", content: "Sua central de estudos com IA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            <div className="relative ml-2 hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar documento, tópico, quiz..."
                className="w-full rounded-md border border-border/60 bg-surface/60 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary" />
                sistema online
              </span>
              <button className="grid h-9 w-9 place-items-center rounded-md border border-border/60 bg-surface/60 text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="min-w-0 flex-1 bg-grid">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
