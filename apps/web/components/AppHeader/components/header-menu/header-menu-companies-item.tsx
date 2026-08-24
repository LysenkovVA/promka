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
import { useAuth } from "@/app/(public)/(auth)/model/hooks/useAuth"
import Link from "next/link"

export const HeaderMenuCompaniesItem = memo((_) => {
  const { activeWorkspace, userWorkspaces } = useAuth()

  // const router = useRouter()

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
              <Link key={workspace.id} href={`/workspaces/${workspace?.id}`}>
                <DropdownMenuItem>{workspace.company.name}</DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
