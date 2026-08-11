"use client"

import { memo } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
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

  const { data } = useCompaniesSimpleList()

  return (
    <DynamicModuleLoader
      reducers={{ companiesSimpleListSchema: companiesSimpleListReducer }}
    >
      {/*Содержит сворачиваемый контент*/}
      <Collapsible defaultOpen className="group/collapsible">
        {/*Группа*/}
        <SidebarGroup>
          <SidebarGroupLabel asChild className={"m-0 p-0"}>
            <CollapsibleTrigger>
              <Link
                className={
                  "m-auto flex w-full flex-row items-center justify-start gap-1"
                }
                href={ROUTE.DASHBOARD.href}
              >
                <IconLayoutDashboard className="size-3" />
                <div className="text-sm">{ROUTE.DASHBOARD.name}</div>
              </Link>
              {data?.length > 0 && (
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              )}
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
                      <div className="text-xs">{company.name}</div>
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
