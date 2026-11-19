"use client"

import { memo, useState } from "react"
import { EmployeeHelper, FieldEmployee } from "@/Employees"
import { FormCollection } from "@/components/form/form-collection/form-collection"
import { Button } from "@workspace/ui/components/button"
import { IconTrash } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog"

export interface FormCollectionEmployeesProps {
  name: string
}

export const FormCollectionEmployees = memo(
  (props: FormCollectionEmployeesProps) => {
    const { name } = props

    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

    const { watch } = useFormContext()

    return (
      <FormCollection
        name={name}
        defaultRowValues={null}
        listTitle={"Список сотрудников"}
        showAddButton={true}
        addButtonTitle={
          watch(name)?.length > 0 ? "Сотрудник" : "Список сотрудников"
        }
      >
        {(fields, methods) => (
          <>
            {fields.map((field, index) => (
              <div
                key={index}
                className={"flex items-start justify-start gap-2"}
              >
                <div className={"mt-2 flex items-center justify-center gap-1"}>
                  <Button
                    type={"button"}
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => {
                      if (watch(methods.getItemPath(index))?.id) {
                        setIsOpenDeleteDialog(true)
                      } else {
                        methods.remove(index)
                      }
                    }}
                  >
                    <IconTrash className={"text-destructive"} />
                  </Button>
                  <div
                    className={"text-xl text-muted-foreground"}
                  >{`${index + 1}.`}</div>
                </div>
                <FieldEmployee name={methods.getItemPath(index)} />
                {isOpenDeleteDialog && (
                  <DeleteDialog
                    isOpen={isOpenDeleteDialog}
                    onOpenChange={setIsOpenDeleteDialog}
                    deleteMessage={`Удалить ${watch(methods.getItemPath(index))?.id ? EmployeeHelper.getFullName(watch(methods.getItemPath(index))) : "пустое поле"} из списка сотрудников?`}
                    onOk={() => {
                      methods.remove(index)
                      setIsOpenDeleteDialog(false)
                    }}
                    onCancel={() => setIsOpenDeleteDialog(false)}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </FormCollection>
    )
  }
)
