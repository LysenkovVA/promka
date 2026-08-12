"use client"

import { memo, useState } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar"
import { ROUTE } from "@/config/routes"
import Link from "next/link"
import { IconCirclePlusFilled, IconUsers } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { EditEmployeeSheet } from "@/app/(private)/(employees)"

export interface EmployeesProps {}

export const Employees = memo((props: EmployeesProps) => {
  const {} = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className={"flex w-full flex-row items-center justify-between"}>
          <Link
            className={
              "m-auto flex w-full flex-row items-center justify-start gap-1"
            }
            href={ROUTE.EMPLOYEES.href}
          >
            <IconUsers className="size-3" />
            <div>{ROUTE.EMPLOYEES.name}</div>
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
