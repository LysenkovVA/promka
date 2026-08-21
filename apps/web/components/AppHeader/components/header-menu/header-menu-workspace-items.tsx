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
import { WORKSPACE_ROUTE } from "@/config/workspace-routes"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"

export const HeaderMenuWorkspaceItems = memo((_) => {
  const { activeWorkspace } = useAuth()
  const [workspaceItem, setWorkspaceItem] = useState(WORKSPACE_ROUTE.DASHBOARD)
  const router = useRouter()

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            {workspaceItem.name}
            <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {Object.entries(WORKSPACE_ROUTE).map(([key, wsRoute]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => {
                  setWorkspaceItem(wsRoute)
                  router.push(
                    `${wsRoute.href}?workspaceId=${activeWorkspace?.id}`
                  )
                }}
              >
                {wsRoute.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
