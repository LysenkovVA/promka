"use client"

import { memo } from "react"
import { FormCollection } from "@/components/form/form-collection/form-collection"
import { Button } from "@workspace/ui/components/button"
import { IconTrash } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { FieldTextArea } from "@/components/form/field-text-area/field-text-area"

export interface FormCollectionPassportsProps {
  name: string
  limit: number
}

export const FormCollectionPassports = memo(
  (props: FormCollectionPassportsProps) => {
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
            ? "Паспорт"
            : watch(name)?.length > 0
              ? "Паспорт"
              : "Список паспортов"
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
                  <div className={"text-muted-foreground"}>{`Паспорт`}</div>
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
                  <FieldGroup className={"grid grid-cols-1 gap-2"}>
                    <FieldInput
                      name={methods.getItemPath(index, "issuedBy")}
                      placeholder={"Кем выдан"}
                      label={"Кем выдан"}
                      required
                    />
                  </FieldGroup>
                  <FieldGroup className={"grid grid-cols-3 gap-2"}>
                    <FieldInput
                      name={methods.getItemPath(index, "subdivisionCode")}
                      placeholder={"Код подразделения"}
                      label={"Код подразделения"}
                    />
                    <FieldDatePicker
                      name={methods.getItemPath(index, "issueDate")}
                      // placeholder={"Дата выдачи"}
                      label={"Дата выдачи"}
                    />
                    <FieldInput
                      name={methods.getItemPath(index, "birthPlace")}
                      placeholder={"Место рождения"}
                      label={"Место рождения"}
                    />
                  </FieldGroup>
                  <FieldGroup className={"grid grid-cols-1 gap-2"}>
                    <FieldTextArea
                      name={methods.getItemPath(index, "registrationAddress")}
                      placeholder={"Адрес регистрации"}
                      label={"Адрес регистрации"}
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
