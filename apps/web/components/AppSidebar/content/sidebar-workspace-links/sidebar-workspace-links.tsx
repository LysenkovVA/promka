"use client"

import { memo } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { IconId, IconUsers } from "@tabler/icons-react"
import { generateWorkspaceRoutes } from "@/config/workspace-routes"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"

export interface SidebarWorkspaceLinksProps {}

export const SidebarWorkspaceLinks = memo(
  (props: SidebarWorkspaceLinksProps) => {
    const { activeWorkspace } = useAuth()

    const workspaceRoutes = activeWorkspace
      ? generateWorkspaceRoutes(activeWorkspace.id)
      : null

    return (
      <SidebarGroup className={"mt-4"}>
        <SidebarGroupLabel className={"mb-2 bg-secondary"}>
          {activeWorkspace?.company?.name}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div
            className={"flex w-full flex-col items-center justify-center gap-3"}
          >
            {workspaceRoutes && (
              <>
                <Link
                  className={
                    "m-auto flex w-full flex-row items-center justify-start gap-1"
                  }
                  href={workspaceRoutes.EMPLOYEES.href}
                >
                  <IconUsers className="size-4" />
                  <div>{workspaceRoutes.EMPLOYEES.name}</div>
                </Link>
                <Link
                  className={
                    "m-auto flex w-full flex-row items-center justify-start gap-1"
                  }
                  href={workspaceRoutes.STUDIES.href}
                >
                  <IconId className="size-4" />
                  <div>{workspaceRoutes.STUDIES.name}</div>
                </Link>
              </>
            )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }
)
