"use client"
import { usePathname } from "next/navigation"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from "next/link"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarMenu className="gap-2 px-2">
      {items.map((item) => {
        const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
        const Icon = item.icon

        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              className={`transition-colors rounded-md px-3 py-2 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <Link href={item.url} className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}