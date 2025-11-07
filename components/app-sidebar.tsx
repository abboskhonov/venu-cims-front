"use client"
import * as React from "react"
import { IconHome, IconChartBar, IconShoppingCart } from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/lib/api/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: IconChartBar,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isUserLoading } = useAuth()

  // Type guard to ensure user has required properties
  const isValidUser = (user: unknown): user is User => {
    return user !== null &&
           user !== undefined &&
           typeof user === 'object' &&
           'name' in user &&
           'email' in user &&
           typeof (user as User).name === 'string' &&
           typeof (user as User).email === 'string'
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto py-2 px-2 hover:bg-sidebar-accent">
              <a href="#" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <IconShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">Venu Market</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {!isUserLoading && isValidUser(user) ? (
          <NavUser user={{ name: user.name, email: user.email }} />
        ) : (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}