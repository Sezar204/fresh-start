import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Factory as FactoryIcon,
  Info,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/epmic/stat-card";
import { getDecisions, getFactory, statusLabel } from "@/lib/epmic-data";

export const Route = createFileRoute("/factory/$factoryId/")({
  component: FactoryDashboard,
});

const severityMeta = {
  info: { icon: Info, className: "text-info", badge: "outline" as const, label: "Info" },
  warning: {
    icon: AlertTriangle,
    className: "text-warning",
    badge: "secondary" as const,
    label: "Warning",
  },
  critical: {
    icon: AlertOctagon,
    className: "text-destructive",
    badge: "destructive" as const,
    label: "Critical",
  },
};

function FactoryDashboard() {
  const { factoryId } = Route.useParams();
  const factory = getFactory(factoryId)!;
  const decisions = getDecisions(factoryId);
  const criticalCount = decisions.filter((d) => d.severity === "critical").length;

  const statusTone =
    factory.status === "healthy"
      ? "success"
      : factory.status === "attention"
        ? "warning"
        : "danger";

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Factory dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What is the right decision, right now for {factory.name}?
          </p>
        </div>
        <Badge
          variant={
            factory.status === "critical"
              ? "destructive"
              : factory.status === "attention"
                ? "secondary"
                : "outline"
          }
          className="text-sm"
        >
          {factory.status === "healthy" ? (
            <CheckCircle2 className="mr-1.5 h-4 w-4 text-success" />
          ) : factory.status === "attention" ? (
            <AlertTriangle className="mr-1.5 h-4 w-4 text-warning" />
          ) : (
            <AlertOctagon className="mr-1.5 h-4 w-4" />
          )}
          {statusLabel(factory.status)}
        </Badge>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="OEE"
          value={factory.oee}
          suffix="%"
          tone={statusTone}
          icon={Activity}
          hint="Target 85%"
        />
        <StatCard
          label="On-time delivery"
          value={factory.onTime}
          suffix="%"
          tone="info"
          icon={Clock}
          hint="Last 7 days"
        />
        <StatCard
          label="Scrap rate"
          value={factory.scrap}
          suffix="%"
          tone={factory.scrap > 3 ? "danger" : "success"}
          icon={TrendingUp}
          hint="Target < 2%"
        />
        <StatCard
          label="Active orders"
          value={factory.activeOrders}
          tone="default"
          icon={Package}
          hint={`${factory.headcount} people on site`}
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Decisions to make now</h2>
          {criticalCount > 0 && (
            <Badge variant="destructive">
              {criticalCount} critical
            </Badge>
          )}
        </div>
        {decisions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No decisions require action.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {decisions.map((d) => {
              const meta = severityMeta[d.severity];
              const Icon = meta.icon;
              return (
                <Card key={d.id}>
                  <CardContent className="flex gap-4 p-5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ${meta.className}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{d.title}</h3>
                        <Badge variant={meta.badge}>{meta.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{d.detail}</p>
                      <div className="mt-3 rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2 text-sm">
                        <span className="font-medium text-primary">Recommended:</span>{" "}
                        <span className="text-foreground">{d.recommendation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FactoryIcon className="h-4 w-4 text-primary" /> Plant profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row label="Code" value={factory.code} />
            <Row label="Location" value={factory.location} />
            <Row label="Headcount" value={String(factory.headcount)} />
            <Row label="Active orders" value={String(factory.activeOrders)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" /> Coming next
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Master data, production planning, inventory, quality and the rest of
            the factory workspace ship in Phase 2 once Lovable Cloud is enabled.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
