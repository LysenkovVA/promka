"use client"

import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/config/routes"

export function AppHeader() {
  const path = usePathname()

  const headerName = (() => {
    const entry = Object.values(ROUTE).find((route) => route.href === path)
    return entry?.name ?? "Неизвестный маршрут"
  })()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <h1 className="text-base font-medium">{headerName}</h1>
      </div>
    </header>
  )
}
