"use client"

import { memo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/config/routes"
import { IconLayoutDashboard } from "@tabler/icons-react"
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"

export interface HeaderMenuProps {}

export const HeaderMenu = memo((props: HeaderMenuProps) => {
  const {} = props

  const path = usePathname()

  const headerName = (() => {
    const entry = Object.values(ROUTE).find((route) => route.href === path)
    return entry?.name ?? "Неизвестный маршрут"
  })()

  const activeCompany = useActiveCompany()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">
            <IconLayoutDashboard className={"size-5! w-fit flex-shrink-0"} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/*<BreadcrumbItem>*/}
        {/*  {activeCompany?.id && (*/}
        {/*    <BreadcrumbPage>{activeCompany?.name}</BreadcrumbPage>*/}
        {/*  )}*/}
        {/*</BreadcrumbItem>*/}
        {/*<BreadcrumbSeparator />*/}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {activeCompany?.id ? activeCompany.name : "Main"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
})
