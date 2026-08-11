"use client"

import { memo } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar"
import { ROUTE } from "@/config/routes"
import Link from "next/link"
import { IconUsers } from "@tabler/icons-react"

export interface EmployeesProps {}

export const Employees = memo((props: EmployeesProps) => {
  const {} = props

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <Link
          className={
            "m-auto flex w-full flex-row items-center justify-start gap-1"
          }
          href={ROUTE.EMPLOYEES.href}
        >
          <IconUsers className="size-3" />
          <div>{ROUTE.EMPLOYEES.name}</div>
        </Link>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})
