"use client"

import { memo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@workspace/ui/components/breadcrumb"
import { usePathname } from "next/navigation"
import { ROUTE } from "@/config/routes"
import { IconLayoutDashboard } from "@tabler/icons-react"
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import { getCompaniesSimpleList } from "@/app/(private)/(companies)/model/selectors/companies-simple-list-selectors"
import { changeActiveCompanyThunk } from "@/app/(auth)/model/thunks/changeActiveCompanyThunk"
import { HeaderMenuSeparator } from "@/components/AppHeader/components/header-menu/header-menu-separator"

export interface HeaderMenuProps {}

export const HeaderMenu = memo((props: HeaderMenuProps) => {
  const {} = props

  const companies = useAppSelector(getCompaniesSimpleList.selectAll)

  const dispatch = useAppDispatch()

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

        {/*<BreadcrumbItem>*/}
        {/*  {activeCompany?.id && (*/}
        {/*    <BreadcrumbPage>{activeCompany?.name}</BreadcrumbPage>*/}
        {/*  )}*/}
        {/*</BreadcrumbItem>*/}
        {/*<BreadcrumbSeparator />*/}
        {activeCompany?.id && (
          <>
            <HeaderMenuSeparator />
            {/*<BreadcrumbItem>*/}
            {/*  <BreadcrumbPage>{activeCompany.name}</BreadcrumbPage>*/}
            {/*</BreadcrumbItem>*/}
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1">
                    {activeCompany.name}
                    <ChevronDownIcon
                      data-icon="inline-end"
                      className="size-3.5"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    {companies.map((company) => (
                      <DropdownMenuItem
                        key={company.id}
                        onClick={() => {
                          dispatch(
                            changeActiveCompanyThunk({
                              company: companies?.find(
                                (c) => c.id === company.id
                              ),
                            })
                          )
                        }}
                      >
                        {company.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
        <HeaderMenuSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{headerName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
})
