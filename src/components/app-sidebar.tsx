import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Layers,
  MessageSquare,
  BarChart3,
  Settings,
  BrainCircuit,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Documentos", url: "/app/documents", icon: FileText },
  { title: "Estudar", url: "/app/study", icon: GraduationCap },
  { title: "Flashcards", url: "/app/flashcards", icon: Layers },
  { title: "Chat I.A.", url: "/app/chat", icon: MessageSquare },
];

const bottomItems = [
  { title: "Estatísticas", url: "/app/stats", icon: BarChart3 },
  { title: "Configurações", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const renderItem = (item: (typeof mainItems)[number]) => {
    const active = isActive(item.url, item.exact);
    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton
          asChild
          isActive={active}
          className={
            active
              ? "bg-gradient-to-r from-primary/20 to-transparent text-foreground border-l-2 border-primary rounded-l-none"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }
        >
          <Link to={item.url}>
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40" style={{ backgroundColor: "var(--sidebar)" }}>
      <SidebarHeader className="border-b border-border/40 py-4">
        <Link to="/app" className="flex items-center gap-2 px-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary shadow-[var(--shadow-glow)]">
            <BrainCircuit className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-base font-semibold tracking-tight">nexlearn</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Conta
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{bottomItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/50 text-sm font-semibold text-primary-foreground">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Aluno Nexlearn</p>
              <p className="truncate text-xs text-muted-foreground">Plano Pro</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
