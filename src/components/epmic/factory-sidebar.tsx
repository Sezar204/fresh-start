import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Gauge,
  Factory as FactoryIcon,
  ShoppingCart,
  Boxes,
  Warehouse,
  ShieldCheck,
  Wrench,
  Users,
  DollarSign,
  FileBarChart,
  Settings as SettingsIcon,
  Database,
  ChevronLeft,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Factory } from "@/lib/epmic-data";

interface Item {
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
}

export function FactorySidebar({ factory }: { factory: Factory }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/factory/${factory.id}`;

  const overview: Item[] = [
    { title: "Dashboard", to: `${base}`, icon: LayoutDashboard },
    { title: "KPI Center", to: `${base}/kpis`, icon: Gauge, soon: true },
  ];
  const operate: Item[] = [
    { title: "Production", to: `${base}/production`, icon: FactoryIcon, soon: true },
    { title: "Sales planning", to: `${base}/sales`, icon: ShoppingCart, soon: true },
    { title: "Procurement", to: `${base}/procurement`, icon: ShoppingCart, soon: true },
    { title: "Inventory", to: `${base}/inventory`, icon: Boxes, soon: true },
    { title: "Warehouse", to: `${base}/warehouse`, icon: Warehouse, soon: true },
    { title: "Quality", to: `${base}/quality`, icon: ShieldCheck, soon: true },
    { title: "Maintenance", to: `${base}/maintenance`, icon: Wrench, soon: true },
    { title: "Workforce", to: `${base}/workforce`, icon: Users, soon: true },
    { title: "Cost", to: `${base}/cost`, icon: DollarSign, soon: true },
  ];
  const admin: Item[] = [
    { title: "Master data", to: `${base}/master-data`, icon: Database, soon: true },
    { title: "Reports", to: `${base}/reports`, icon: FileBarChart, soon: true },
    { title: "Settings", to: `${base}/settings`, icon: SettingsIcon, soon: true },
  ];

  const isActive = (to: string) =>
    to === base ? pathname === base || pathname === `${base}/` : pathname.startsWith(to);

  const renderGroup = (label: string, items: Item[]) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild={!item.soon}
                isActive={isActive(item.to)}
                tooltip={item.title}
                aria-disabled={item.soon}
                className={item.soon ? "cursor-not-allowed opacity-50" : ""}
              >
                {item.soon ? (
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-60">
                          soon
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <Link to={item.to} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-2 text-sidebar-foreground hover:text-sidebar-primary-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                Hub
              </div>
              <div className="truncate text-sm font-semibold">{factory.code}</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Overview", overview)}
        {renderGroup("Operate", operate)}
        {renderGroup("Admin", admin)}
      </SidebarContent>
    </Sidebar>
  );
}
