import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/epmic/stat-card";
import { factories, statusLabel, type FactoryStatus } from "@/lib/epmic-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manufacturing Hub — EPMIC" },
      {
        name: "description",
        content:
          "EPMIC Manufacturing Hub. Cross-factory overview and the right decision, right now.",
      },
      { property: "og:title", content: "Manufacturing Hub — EPMIC" },
      {
        property: "og:description",
        content: "Cross-factory overview across your manufacturing network.",
      },
    ],
  }),
  component: HubPage,
});

const statusMeta: Record<
  FactoryStatus,
  { icon: typeof CheckCircle2; className: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  healthy: { icon: CheckCircle2, className: "text-success", variant: "outline" },
  attention: { icon: AlertTriangle, className: "text-warning", variant: "secondary" },
  critical: { icon: AlertOctagon, className: "text-destructive", variant: "destructive" },
};

function HubPage() {
  const total = factories.length;
  const healthy = factories.filter((f) => f.status === "healthy").length;
  const attention = factories.filter((f) => f.status === "attention").length;
  const critical = factories.filter((f) => f.status === "critical").length;
  const avgOee = Math.round(factories.reduce((a, f) => a + f.oee, 0) / total);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              EPMIC
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Manufacturing Hub
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              What is the right decision, right now — across every plant.
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            <Activity className="mr-1.5 h-3.5 w-3.5" />
            Live
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Plants" value={total} icon={Activity} tone="info" hint="Across network" />
          <StatCard label="Healthy" value={healthy} icon={CheckCircle2} tone="success" />
          <StatCard label="Need attention" value={attention} icon={AlertTriangle} tone="warning" />
          <StatCard label="Critical" value={critical} icon={AlertOctagon} tone="danger" />
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-foreground">Factories</h2>
            <div className="text-sm text-muted-foreground">
              Network OEE avg <span className="font-semibold text-foreground">{avgOee}%</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {factories.map((f) => {
              const meta = statusMeta[f.status];
              const Icon = meta.icon;
              return (
                <Link
                  key={f.id}
                  to="/factory/$factoryId"
                  params={{ factoryId: f.id }}
                  className="group"
                >
                  <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {f.code}
                          </div>
                          <div className="mt-1 truncate text-lg font-semibold text-foreground">
                            {f.name}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {f.location}
                          </div>
                        </div>
                        <Badge variant={meta.variant} className="whitespace-nowrap">
                          <Icon className={`mr-1 h-3.5 w-3.5 ${meta.className}`} />
                          {statusLabel(f.status)}
                        </Badge>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4">
                        <Metric label="OEE" value={`${f.oee}%`} />
                        <Metric label="On-time" value={`${f.onTime}%`} />
                        <Metric label="Scrap" value={`${f.scrap}%`} />
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {f.headcount}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-primary group-hover:gap-2 transition-all">
                          Open workspace <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}
