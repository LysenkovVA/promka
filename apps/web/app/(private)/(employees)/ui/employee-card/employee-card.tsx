"use client"

import { memo, useCallback, useState } from "react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { useAppDispatch } from "@/lib/redux"
import { YesNoDialog } from "@/components/YesNoDialog/YesNoDialog"
import { EditEmployeeSheet } from "../edit-employee-sheet/edit-employee-sheet"
import { Employee } from "@/app/(private)/(employees)"
import { Avatar } from "@workspace/ui/components/avatar"
import { useAuth } from "@/app/(public)/(auth)"
import { useRouter } from "next/navigation"

export interface EmployeeWidgetProps {
  employee: Employee
}

export const EmployeeCard = memo((props: EmployeeWidgetProps) => {
  const { employee } = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const dispatch = useAppDispatch()
  const { activeWorkspace } = useAuth()

  const router = useRouter()

  const deleteOrganizationCallback = useCallback(async () => {
    if (employee?.id) {
      // TODO
      // const result = await dispatch(
      //   deleteEmployeeByIdThunk({ id: employee.id })
      // )
      //
      // if (result.meta.requestStatus === "fulfilled") {
      //   toast.success("Сотрудник удалён", { position: "top-center" })
      // } else {
      //   toast.error(JSON.stringify(result.payload))
      // }
    }
  }, [employee?.id])

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
        {/*<ItemActions*/}
        {/*  className={"flex h-full flex-col items-center justify-center"}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    className={"cursor-pointer"}*/}
        {/*    variant={"outline"}*/}
        {/*    onClick={(e) => {*/}
        {/*      e.stopPropagation()*/}
        {/*      setSheetIsOpen(true)*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <IconEditFilled className={"fill-orange-300"} />*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    className={"cursor-pointer"}*/}
        {/*    variant={"outline"}*/}
        {/*    onClick={(e) => {*/}
        {/*      e.stopPropagation()*/}
        {/*      setDeleteModalIsOpen(true)*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <IconTrash className={"text-red-400"} />*/}
        {/*  </Button>*/}
        {/*</ItemActions>*/}
      </Item>
      {sheetIsOpen && (
        <EditEmployeeSheet
          isOpen={sheetIsOpen}
          handleOpenChange={(isOpen) => setSheetIsOpen(isOpen)}
          employeeId={employee?.id ?? undefined}
        />
      )}
      {deleteModalIsOpen && (
        <YesNoDialog
          isOpen={deleteModalIsOpen}
          onOpenChange={(isOpen) => setDeleteModalIsOpen(isOpen)}
          title={"Удаление"}
          content={"Удалить выбранного сотрудника?"}
          onSubmit={async () => {
            setDeleteModalIsOpen(false)
            await deleteOrganizationCallback()
          }}
          onClose={() => setDeleteModalIsOpen(false)}
        />
      )}
    </>
  )
})
