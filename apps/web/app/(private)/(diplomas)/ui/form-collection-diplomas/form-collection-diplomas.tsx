"use client"

import { memo } from "react"
import { FormCollection } from "@/components/form/form-collection/form-collection"
import { Button } from "@workspace/ui/components/button"
import { IconTrash } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"

export interface FormCollectionDiplomasProps {
  name: string
  limit: number
}

export const FormCollectionDiplomas = memo(
  (props: FormCollectionDiplomasProps) => {
    const { name, limit } = props

    const { watch } = useFormContext()

    return (
      <FormCollection
        name={name}
        defaultRowValues={[]}
        // listTitle={limit === 1 ? "Паспорт" : "Список паспортов"}
        showAddButton={watch(name)?.length ? limit < watch(name)?.length : true}
        addButtonTitle={
          limit === 1
            ? "Диплом"
            : watch(name)?.length > 0
              ? "Диплом"
              : "Список дипломов"
        }
      >
        {(fields, methods) => (
          <>
            {fields.map((field, index) => (
              <div
                key={index}
                className={"flex flex-row items-start justify-start gap-4"}
              >
                <div className={"flex items-center justify-center gap-1"}>
                  <Button
                    type={"button"}
                    size={"icon"}
                    variant={"destructive"}
                    onClick={() => methods.remove(index)}
                  >
                    <IconTrash className={"text-destructive"} />
                  </Button>
                  <div className={"text-muted-foreground"}>{`Диплом`}</div>
                </div>
                <div
                  className={
                    "flex w-full flex-col items-start justify-center gap-2"
                  }
                >
                  <FieldGroup className={"grid grid-cols-4 gap-2"}>
                    <FieldInput
                      name={methods.getItemPath(index, "series")}
                      placeholder={"Серия"}
                      label={"Серия"}
                      required
                    />
                    <FieldInput
                      name={methods.getItemPath(index, "number")}
                      placeholder={"Номер"}
                      label={"Номер"}
                      required
                    />
                  </FieldGroup>
                </div>
              </div>
            ))}
          </>
        )}
      </FormCollection>
    )
  }
)
