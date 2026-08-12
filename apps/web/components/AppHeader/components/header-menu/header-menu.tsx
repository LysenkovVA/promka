"use client"

import { memo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb"
import { IconLayoutDashboard } from "@tabler/icons-react"
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"
import { HeaderMenuSeparator } from "@/components/AppHeader/components/header-menu/header-menu-separator"
import { HeaderMenuCompaniesItem } from "@/components/AppHeader/components/header-menu/header-menu-companies-item"
import { HeaderMenuWorkspaceItems } from "@/components/AppHeader/components/header-menu/header-menu-workspace-items"

export const HeaderMenu = memo((_) => {
  // const path = usePathname()

  // const headerName = (() => {
  //   const entry = Object.values(ROUTE).find((route) => route.href === path)
  //   return entry?.name ?? "Неизвестный маршрут"
  // })()

  const activeCompany = useActiveCompany()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <IconLayoutDashboard className={"size-5! w-fit flex-shrink-0"} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {activeCompany?.id && (
          <>
            <HeaderMenuSeparator />
            <HeaderMenuCompaniesItem />
          </>
        )}
        <HeaderMenuSeparator />
        <HeaderMenuWorkspaceItems />
      </BreadcrumbList>
    </Breadcrumb>
  )
})
