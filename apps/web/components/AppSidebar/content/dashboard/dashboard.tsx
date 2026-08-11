"use client"

import { memo } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { usePathname } from "next/navigation"
import { DynamicModuleLoader } from "@/lib/redux"
import {
  companiesSimpleListReducer,
  useCompaniesSimpleList,
} from "@/app/(private)/(companies)"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { IconBuilding, IconLayoutDashboard } from "@tabler/icons-react"
import { ROUTE } from "@/config/routes"

export interface DashboardProps {}

export const Dashboard = memo((props: DashboardProps) => {
  const {} = props

  const path = usePathname()

  const { data } = useCompaniesSimpleList()

  return (
    <DynamicModuleLoader
      reducers={{ companiesSimpleListSchema: companiesSimpleListReducer }}
    >
      {/*Содержит сворачиваемый контент*/}
      <Collapsible defaultOpen className="group/collapsible">
        {/*Группа*/}
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              <Link
                className={
                  "m-auto flex w-full flex-row items-center justify-start gap-1"
                }
                href={ROUTE.DASHBOARD.href}
              >
                <IconLayoutDashboard className="size-5!" />
                <div className="text-base">{ROUTE.DASHBOARD.name}</div>
              </Link>
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                {data.map((company) => (
                  <SidebarMenuSubButton asChild key={company.id}>
                    <Link
                      className={
                        "m-auto flex w-full flex-row items-center justify-start gap-1"
                      }
                      href={`/dashboard?companyId=${company.id}`}
                    >
                      <IconBuilding className="size-3" />
                      <div className="truncate text-xs">{company.name}</div>
                    </Link>
                  </SidebarMenuSubButton>
                ))}
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </DynamicModuleLoader>
  )
})

//   <Collapsible defaultOpen className="group/collapsible">
//   <SidebarGroup>
//   {/*<SidebarGroupLabel asChild>*/}
// {/*  */}
// {/*</SidebarGroupLabel>*/}
// <SidebarMenuItem>
//   <CollapsibleTrigger>
//     <SidebarMenuButton
//       asChild
//       isActive={path === ROUTE.DASHBOARD.href}
//     >
//
//       <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
//   </CollapsibleTrigger>
//   <Link href={ROUTE.DASHBOARD.href}>
//     <IconLayoutDashboard className="size-5!" />
//     <span className="text-base">{ROUTE.DASHBOARD.name}</span>
//   </Link>
// </SidebarMenuButton>
// <CollapsibleContent>
//   <SidebarMenuSub>
//     {data.map((company) => (
//       <SidebarMenuSubItem key={company.id}>
//         <div className={"size-3 font-light"}>{company.name}</div>
//       </SidebarMenuSubItem>
//     ))}
//   </SidebarMenuSub>
// </CollapsibleContent>
// </SidebarMenuItem>
// </SidebarGroup>
// </Collapsible>
