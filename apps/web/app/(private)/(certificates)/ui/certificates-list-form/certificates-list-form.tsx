"use client"

import { memo, RefObject, useCallback } from "react"
import {
  Certificate,
  CertificateSchema,
} from "../../model/types/certificate.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { ZOD_INVALID_OBJECT_TYPE } from "@/lib/zod/commonErrors"
import { FieldDescription } from "@workspace/ui/components/field"
import { toast } from "sonner"
import { ProtocolSchema } from "@/Protocols"
import { GenericInnerList } from "@/components/form/form-generic-inner-list/form-generic-inner-list"
import { FieldCertificateType } from "@/CertificateTypes"
import { FieldEmployee } from "@/Employees"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"

export interface CertificatesListFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  onSubmit?: (data: Certificate[]) => void
}

const formSchema = z.object({
  protocols: z
    .array(
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { ProtocolSchema } = require("@/Protocols")
        return ProtocolSchema
      }),
      {
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_OBJECT_TYPE
          }
        },
      }
    )
    .nullish(),
  certificates: z
    .array(
      // Для устранения ошибок с циклическими зависимостями
      z.lazy(() => {
        const { CertificateSchema } = require("@/Certificates")
        return CertificateSchema
      }),
      {
        error: (issue) => {
          switch (issue.code) {
            case "invalid_type":
              return ZOD_INVALID_OBJECT_TYPE
          }
        },
      }
    )
    .nullish(),
})

export const CertificatesListForm = memo((props: CertificatesListFormProps) => {
  const { submitRef, onSubmit } = props

  /**
   * If your schema uses .default(...) on a field,
   * that field becomes optional on the schema's input type (z.input)
   * but stays required on its output type (z.output/z.infer) —
   * the default only fills it in after validation. Passing a single
   * generic to useForm<T> pins both to the same type and will conflict
   * with zodResolver, which infers input and output separately.
   * Either omit the generic and let it infer from resolver, or specify all three explicitly
   */
  const form = useForm<
    z.input<typeof formSchema>,
    any,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: { protocols: [], certificates: [] },
  })

  const onSubmitForm = useCallback(
    async (formData: any) => {
      toast.message("Сохранение и валидация в разработке...")
    },
    [onSubmit]
  )

  return (
    <form
      id={"certificates-list-form"}
      className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit(onSubmitForm, (errors) => {
          if (process.env.NODE_ENV === "development") {
            toast.error(JSON.stringify(errors))
          }
        })(e)
      }}
    >
      <FieldDescription className={"rounded-lg border bg-muted p-2 text-xl"}>
        {"Удостоверения без протокола"}
      </FieldDescription>
      <GenericInnerList
        name={`certificates`}
        control={form.control}
        register={form.register}
        formState={form.formState}
        renderItems={(subFields, { append, remove, getPath, errors }) => (
          <div style={{ marginLeft: "20px" }}>
            <h5>Удостоверения</h5>

            {/* Ошибка самого массива (например, если пустой) */}
            {errors?.root && (
              <p style={{ color: "red" }}>{errors.root.message}</p>
            )}

            {subFields.map((subField, subIndex) => {
              return (
                <div key={subField.id} style={{ display: "flex", gap: "10px" }}>
                  <div
                    className={
                      "grid w-full grid-cols-2 gap-2 rounded-lg border p-4"
                    }
                  >
                    <FieldEmployee
                      form={form}
                      path={getPath(subIndex, "employee")}
                      label={"Кому принадлежит"}
                      required={true}
                    />
                    {/*  {nameError && (*/}
                    {/*    <p style={{ color: "red" }}>{nameError.message}</p>*/}
                    {/*  )}*/}
                    <FieldCertificateType
                      required={true}
                      form={form}
                      path={getPath(subIndex, "certificateType")}
                      label={"Тип"}
                    />
                    <FieldInput
                      required={true}
                      form={form}
                      path={getPath(subIndex, "number")}
                      label={"Номер"}
                    />
                    <FieldDatePicker
                      form={form}
                      path={getPath(subIndex, "date")}
                      label={"Дата"}
                    />
                    {form.watch(getPath(subIndex, "certificateType"))?.id &&
                      form.watch(getPath(subIndex, "certificateType"))
                        ?.hasGroups && (
                        <FieldInput
                          required={true}
                          form={form}
                          path={getPath(subIndex, "group")}
                          label={"Группа"}
                          placeholder={"Укажите группу"}
                        />
                      )}
                  </div>

                  <button type="button" onClick={() => remove(subIndex)}>
                    Удалить
                  </button>
                </div>
              )
            })}

            <button type="button" onClick={() => append({ date: new Date() })}>
              + Добавить удостоверение
            </button>
          </div>
        )}
      />

      <input type={"submit"} hidden ref={submitRef} />
    </form>
  )
})
