"use client"

import { memo, useMemo } from "react"
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
import { usePathname } from "next/navigation"

export const HeaderMenuWorkspaceItems = memo((_) => {
  const { activeWorkspace } = useAuth()

  const path = usePathname()

  const workspaceRoutes = activeWorkspace
    ? generateWorkspaceRoutes(activeWorkspace.id)
    : null

  const currentRouteName = useMemo(() => {
    if (!workspaceRoutes) return null

    const found = Object.values(workspaceRoutes).find(
      (route) => path === route.href
    )
    return found?.name ?? null
  }, [path, workspaceRoutes])

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1">
            {currentRouteName ?? activeWorkspace?.name ?? "NO NAME"}
            <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {workspaceRoutes &&
              Object.entries(workspaceRoutes).map(([key, wsRoute]) => (
                <DropdownMenuItem key={key} asChild>
                  <Link href={wsRoute.href}>{wsRoute.name}</Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
})
