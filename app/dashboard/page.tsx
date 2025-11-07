'use client'

import { AppSidebar } from "@/components/app-sidebar";
import { UsersTable } from "@/components/users-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminCards } from "@/components/admin-cards";

export default function Page() {
  const { users, isLoading, isError } = useAdmin();

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
        <SiteHeader header="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
              <AdminCards />
              {isLoading && <p>Loading...</p>}
              {isError && <p>Error fetching users</p>}
              {users && <UsersTable data={users} />}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
