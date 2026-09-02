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
import Link from "next/link"
import { usePathname } from "next/navigation"

export const HeaderMenu = memo((_) => {
  const { activeWorkspace } = useAuth()

  const path = usePathname()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/dashboard">
            <IconLayoutDashboard className={"size-5! w-fit flex-shrink-0"} />
          </Link>
        </BreadcrumbItem>
        {activeWorkspace?.id && path !== "/profile" && (
          <>
            <HeaderMenuSeparator />
            <HeaderMenuCompaniesItem />
            <HeaderMenuSeparator />
            <HeaderMenuWorkspaceItems />
          </>
        )}
        {path === "/profile" && (
          <>
            <HeaderMenuSeparator />
            <div>{"Мой профиль"}</div>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
})
