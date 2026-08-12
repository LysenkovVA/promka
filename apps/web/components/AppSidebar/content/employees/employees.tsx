"use client"

import { memo, useState } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { IconCirclePlusFilled, IconUsers } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { EditEmployeeSheet } from "@/app/(private)/(employees)"
import { useActiveCompany } from "@/app/(auth)/model/hooks/useActiveCompany"
import { WORKSPACE_ROUTE } from "@/config/workspace-routes"

export interface EmployeesProps {}

export const Employees = memo((props: EmployeesProps) => {
  const {} = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)

  const activeCompany = useActiveCompany()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className={"flex w-full flex-row items-center justify-between"}>
          <Link
            className={
              "m-auto flex w-full flex-row items-center justify-start gap-1"
            }
            href={`${WORKSPACE_ROUTE.EMPLOYEES.href}?workspaceId=${activeCompany?.workspace?.id}`}
          >
            <IconUsers className="size-3" />
            <div>{WORKSPACE_ROUTE.EMPLOYEES.name}</div>
          </Link>
          <Button variant={"ghost"} onClick={() => setSheetIsOpen(true)}>
            <IconCirclePlusFilled className={"fill-green-500"} />
          </Button>
          {sheetIsOpen && (
            <EditEmployeeSheet
              isOpen={sheetIsOpen}
              handleOpenChange={(isOpen) => setSheetIsOpen(isOpen)}
              employeeId={undefined}
            />
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})
