"use client"

import { memo, useCallback, useState } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"
import { IconEditFilled, IconTrash } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { useAppDispatch } from "@/lib/redux"
import { YesNoDialog } from "@/components/YesNoDialog/YesNoDialog"
import { toast } from "sonner"
import { IEmployeeEntity } from "../../model/types/IEmployeeEntity"
import { deleteEmployeeByIdThunk } from "@/app/(private)/(employees)/model/thunks/delete-employee-by-id-thunk"
import { EditEmployeeSheet } from "../edit-employee-sheet/edit-employee-sheet"

export interface EmployeeWidgetProps {
  employee: IEmployeeEntity
}

export const EmployeeCard = memo((props: EmployeeWidgetProps) => {
  const { employee } = props

  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)

  const dispatch = useAppDispatch()

  const deleteOrganizationCallback = useCallback(async () => {
    if (employee?.id) {
      const result = await dispatch(
        deleteEmployeeByIdThunk({ id: employee.id })
      )

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Сотрудник удалён", { position: "top-center" })
      } else {
        toast.error(JSON.stringify(result.payload))
      }
    }
  }, [employee.id, dispatch])

  return (
    <>
      <Item
        className={"min-h-44 w-full cursor-pointer"}
        variant={"outline"}
        onClick={() => {
          // router.push(`/dashboard?employeeId=${employee.id}`)
          alert("В разработке")
        }}
      >
        <ItemContent className={"h-full w-full"}>
          <div className={"flex h-full flex-col items-center justify-between"}>
            <div className={"h-full w-full"}>
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
            </div>
          </div>
        </ItemContent>
        <ItemActions
          className={"flex h-full flex-col items-center justify-center"}
        >
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation()
              setSheetIsOpen(true)
            }}
          >
            <IconEditFilled className={"fill-orange-300"} />
          </Button>
          <Button
            className={"cursor-pointer"}
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation()
              setDeleteModalIsOpen(true)
            }}
          >
            <IconTrash className={"text-red-400"} />
          </Button>
        </ItemActions>
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
