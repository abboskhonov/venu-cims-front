'use client'

import { AppSidebar } from "@/components/app-sidebar";
import { SalesTable } from "@/components/sales-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SalesCards } from "@/components/sales-cards";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader header="Sales" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
              <SalesCards />
              <SalesTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
