import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mic, BookOpen, Brain, Sparkles, Users, Settings, LogOut } from "lucide-react";
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
import { useApp } from "@/context/AppContext";

const items = [
  { title: "Início", url: "/", icon: Home },
  { title: "Banco de Fonemas", url: "/fonemas", icon: Mic },
  { title: "Vocabulário", url: "/vocabulario", icon: BookOpen },
  { title: "Memória Auditiva", url: "/memoria", icon: Brain },
  { title: "Trava-Línguas", url: "/desafios", icon: Sparkles },
  { title: "Habilidades Sociais", url: "/habilidades-sociais", icon: Users },
  { title: "Personalizar", url: "/personalizar", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { mascot, session, sair } = useApp();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <div className="flex items-center gap-3 overflow-hidden px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xl"
            style={{ background: "var(--primary-soft)" }}
            aria-hidden="true"
          >
            {mascot.emoji}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-display text-lg font-bold leading-tight">
              Comunicar<span className="ml-1">+</span>
            </p>
            <p className="truncate text-xs text-muted-foreground">{mascot.name}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="h-12 text-base"
                    >
                      <Link to={item.url} onClick={() => setOpenMobile(false)}>
                        <item.icon className="!h-5 !w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={sair} tooltip="Sair" className="h-12 text-base">
              <LogOut className="!h-5 !w-5" />
              <span className="truncate">{session?.user.email ?? "Sair"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
