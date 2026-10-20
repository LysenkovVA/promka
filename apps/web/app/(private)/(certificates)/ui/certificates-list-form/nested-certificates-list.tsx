"use client"

import { memo } from "react"
import { FieldDescription, FieldGroup } from "@workspace/ui/components/field"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled, IconTrash } from "@tabler/icons-react"
import { FieldEmployee } from "@/Employees"
import { FieldCertificateType } from "@/CertificateTypes"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import {
  ArrayPath,
  FieldValues,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form"

export interface NestedCertificatesListProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  form: UseFormReturn<TFieldValues>
  path: ArrayPath<TFieldValues>
  fieldDescription?: string
  addButtonTitle?: string
}

/**
 * @deprecated
 */
export const NestedCertificatesList = memo(
  <TFieldValues extends FieldValues = FieldValues>(
    props: NestedCertificatesListProps<TFieldValues>
  ) => {
    const {
      form,
      path,
      fieldDescription = "",
      addButtonTitle = "Добавить",
    } = props

    // Работа со списком удостоверений без протоколов
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: path,
    })

    return (
      <FieldGroup className={"w-full"}>
        {fieldDescription && (
          <FieldDescription className={"rounded-lg border bg-muted p-2"}>
            {fieldDescription}
          </FieldDescription>
        )}
        {fields.map((field, index) => (
          <div key={field.id ?? index} className={"w-full"}>
            <div
              className={"mb-2 flex flex-row items-center justify-start gap-2"}
            >
              <div className={"text-xl font-bold"}>{`# ${index + 1}`}</div>
              <Button
                size={"icon"}
                variant={"destructive"}
                onClick={() => remove(index)}
              >
                <IconTrash className={"text-destructive"} />
              </Button>
            </div>
            <div className={"flex flex-row items-center justify-center gap-2"}>
              <div
                className={
                  "grid w-full grid-cols-2 gap-2 rounded-lg border p-4"
                }
              >
                <FieldEmployee
                  form={form}
                  path={`${path}.${index}.employee`}
                  label={"Кому принадлежит"}
                  required={true}
                />
                <FieldCertificateType
                  required={true}
                  form={form}
                  path={`${path}.${index}.certificateType`}
                  label={"Тип"}
                />
                <FieldInput
                  required={true}
                  form={form}
                  path={`${path}.${index}.number`}
                  label={"Номер"}
                />
                <FieldDatePicker
                  form={form}
                  path={`${path}.${index}.date`}
                  label={"Дата"}
                />
                {form.watch(`${path}.${index}.certificateType`)?.id &&
                  form.watch(`${path}.${index}.certificateType`)?.hasGroups && (
                    <FieldInput
                      required={true}
                      form={form}
                      path={`${path}.${index}.group`}
                      label={"Группа"}
                      placeholder={"Укажите группу"}
                    />
                  )}
              </div>
            </div>
          </div>
        ))}
        <Button
          className={"w-fit"}
          variant={"outline"}
          type={"button"}
          onClick={() => {
            append({ date: new Date() })
          }}
        >
          <IconPlusFilled />
          {addButtonTitle}
        </Button>
      </FieldGroup>
    )
  }
)
