"use client"

import { memo, useState } from "react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { EditEmployeeSheet } from "../edit-employee-sheet/edit-employee-sheet"
import { Employee } from "../../model/types/employee.schema"
import { Avatar } from "@workspace/ui/components/avatar"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"

export interface EmployeeWidgetProps {
  employee: Employee
}

export const EmployeeCard = memo((props: EmployeeWidgetProps) => {
  const { employee } = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)

  const { activeWorkspace } = useAuth()

  const router = useRouter()

  return (
    <>
      <Item
        className={"min-h-20 w-full cursor-pointer"}
        variant={"outline"}
        onClick={() => {
          if (activeWorkspace.id)
            router.push(
              `/workspaces/${activeWorkspace.id}/employees/${employee.id}`
            )
        }}
      >
        <ItemContent
          className={
            "flex h-full w-full flex-col items-center justify-start gap-1"
          }
        >
          <Avatar style={{ width: 80, height: 80 }} />
          <ItemTitle
            className={
              "align-center flex w-full justify-center text-center text-xl font-light"
            }
          >
            {employee.surname}
          </ItemTitle>
          <ItemDescription className={"text-md text-start font-light"}>
            {employee.name}
          </ItemDescription>
        </ItemContent>
      </Item>
      {sheetIsOpen && (
        <EditEmployeeSheet
          isOpen={sheetIsOpen}
          handleOpenChange={(isOpen) => setSheetIsOpen(isOpen)}
          employeeId={employee?.id ?? undefined}
        />
      )}
    </>
  )
})
