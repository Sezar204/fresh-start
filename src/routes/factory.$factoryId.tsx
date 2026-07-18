import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FactorySidebar } from "@/components/epmic/factory-sidebar";
import { getFactory } from "@/lib/epmic-data";

export const Route = createFileRoute("/factory/$factoryId")({
  loader: ({ params }) => {
    const factory = getFactory(params.factoryId);
    if (!factory) throw notFound();
    return { factory };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.factory.name} — EPMIC` },
          {
            name: "description",
            content: `Operations workspace for ${loaderData.factory.name} (${loaderData.factory.code}).`,
          },
        ]
      : [{ title: "Factory — EPMIC" }],
  }),
  component: FactoryLayout,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Factory not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That plant isn't in your network.
        </p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">Failed to load factory: {error.message}</div>
  ),
});

function FactoryLayout() {
  const { factory } = Route.useLoaderData();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <FactorySidebar factory={factory} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-card px-4">
            <SidebarTrigger />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                {factory.code} · {factory.location}
              </div>
              <div className="truncate text-sm font-semibold text-foreground">
                {factory.name}
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
