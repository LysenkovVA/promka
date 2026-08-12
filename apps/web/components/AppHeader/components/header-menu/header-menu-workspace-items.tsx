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
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"
import { WORKSPACE_ROUTE } from "@/config/workspace-routes"
import { useRouter } from "next/navigation"

export const HeaderMenuWorkspaceItems = memo((_) => {
  const activeCompany = useActiveCompany()
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
                    `${wsRoute.href}?workspaceId=${activeCompany?.workspace?.id}`
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
