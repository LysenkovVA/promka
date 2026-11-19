"use client"

import { memo, useState } from "react"
import { EmployeeHelper, FieldEmployee } from "@/Employees"
import { FormCollection } from "@/components/form/form-collection/form-collection"
import { Button } from "@workspace/ui/components/button"
import { IconTrash } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"
import { DeleteDialog } from "@/components/delete-dialog/delete-dialog"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"

export interface FormCollectionCertificatesProps {
  name: string
}

export const FormCollectionCertificates = memo(
  (props: FormCollectionCertificatesProps) => {
    const { name } = props

    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

    const { watch } = useFormContext()

    return (
      <FormCollection
        name={name}
        defaultRowValues={null}
        listTitle={"Список удостоверений"}
        showAddButton={true}
        addButtonTitle={
          watch(name)?.length > 0 ? "Удостоверение" : "Список удостоверений"
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
                <div className={"flex w-full flex-col gap-2"}>
                  <div className={"grid grid-cols-2 gap-2"}>
                    <FieldEmployee
                      name={methods.getItemPath(index, "employee")}
                      label={"Сотрудник"}
                    />
                  </div>
                  <div className={"grid grid-cols-4 gap-2"}>
                    <FieldInput
                      name={methods.getItemPath(index, "number")}
                      label={"Номер удостоверения"}
                    />
                    <FieldDatePicker
                      name={methods.getItemPath(index, "date")}
                      label={"Дата удостоверения"}
                    />
                  </div>
                </div>
                {isOpenDeleteDialog && (
                  <DeleteDialog
                    isOpen={isOpenDeleteDialog}
                    onOpenChange={setIsOpenDeleteDialog}
                    deleteMessage={`Удалить удостоверение сотрудника ${watch(methods.getItemPath(index, "employee"))?.id ? EmployeeHelper.getFullName(watch(methods.getItemPath(index, "employee"))) : ""} из списка удостоверений?`}
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
