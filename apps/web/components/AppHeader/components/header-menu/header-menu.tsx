"use client"

import { memo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb"
import { IconLayoutDashboard } from "@tabler/icons-react"
import { HeaderMenuSeparator } from "@/components/AppHeader/components/header-menu/header-menu-separator"
import { HeaderMenuCompaniesItem } from "@/components/AppHeader/components/header-menu/header-menu-companies-item"
import { HeaderMenuWorkspaceItems } from "@/components/AppHeader/components/header-menu/header-menu-workspace-items"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"
import { useAppDispatch } from "@/lib/redux"
import Link from "next/link"

export const HeaderMenu = memo((_) => {
  // const path = usePathname()

  // const headerName = (() => {
  //   const entry = Object.values(ROUTE).find((route) => route.href === path)
  //   return entry?.name ?? "Неизвестный маршрут"
  // })()

  const { activeWorkspace } = useAuth()
  const dispatch = useAppDispatch()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/dashboard">
            <IconLayoutDashboard className={"size-5! w-fit flex-shrink-0"} />
          </Link>
        </BreadcrumbItem>
        {activeWorkspace?.id && (
          <>
            <HeaderMenuSeparator />
            <HeaderMenuCompaniesItem />
            <HeaderMenuSeparator />
            <HeaderMenuWorkspaceItems />
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
})
