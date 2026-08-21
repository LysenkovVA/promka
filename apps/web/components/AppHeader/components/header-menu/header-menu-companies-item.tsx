"use client"

import { memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"
import { BreadcrumbItem } from "@workspace/ui/components/breadcrumb"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"

export const HeaderMenuCompaniesItem = memo((_) => {
  const { activeWorkspace, userWorkspaces } = useAuth()

  const router = useRouter()

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            {activeWorkspace?.company.name}
            <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {userWorkspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => {
                  router.push(`/dashboard?workspaceId=${workspace.id}`)
                  // dispatch(
                  //   changeActiveCompanyThunk({
                  //     company: companies?.find((c) => c.id === company.id),
                  //   })
                  // )
                }}
              >
                {workspace.company.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
