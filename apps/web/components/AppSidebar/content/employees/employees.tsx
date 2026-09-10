"use client"

import { memo } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { IconUsers } from "@tabler/icons-react"
import { generateWorkspaceRoutes } from "@/config/workspace-routes"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"

export interface EmployeesProps {}

export const Employees = memo((props: EmployeesProps) => {
  const {} = props

  const { activeWorkspace } = useAuth()
  const workspaceRoutes = activeWorkspace
    ? generateWorkspaceRoutes(activeWorkspace.id)
    : null

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className={"flex w-full flex-row items-center justify-between"}>
          {workspaceRoutes && (
            <Link
              className={
                "m-auto flex w-full flex-row items-center justify-start gap-1"
              }
              href={workspaceRoutes.EMPLOYEES.href}
            >
              <IconUsers className="size-3" />
              <div>{workspaceRoutes.EMPLOYEES.name}</div>
            </Link>
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})
