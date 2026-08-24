"use client"

import { memo, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { BreadcrumbItem } from "@workspace/ui/components/breadcrumb"
import { generateWorkspaceRoutes } from "@/config/workspace-routes"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"
import Link from "next/link"

export const HeaderMenuWorkspaceItems = memo((_) => {
  const { activeWorkspace } = useAuth()

  const workspaceRoutes = activeWorkspace
    ? generateWorkspaceRoutes(activeWorkspace.id)
    : null

  const [workspaceItem, setWorkspaceItem] = useState(workspaceRoutes?.DASHBOARD)

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            {workspaceItem?.name ?? "NO NAME"}
            <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {workspaceRoutes &&
              Object.entries(workspaceRoutes).map(([key, wsRoute]) => (
                <DropdownMenuItem key={key} asChild>
                  <Link
                    href={wsRoute.href}
                    onClick={() => setWorkspaceItem(wsRoute)}
                  >
                    {wsRoute.name}
                  </Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
