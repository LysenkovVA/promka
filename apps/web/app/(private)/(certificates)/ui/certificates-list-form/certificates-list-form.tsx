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
import { Button } from "@workspace/ui/components/button"
import {
  IconAlertSquareRounded,
  IconPlusFilled,
  IconTrash,
} from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Alert, AlertTitle } from "@workspace/ui/components/alert"

export interface CertificatesListFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  onSubmit?: (data: Certificate[]) => void
}

const formSchema = z
  .object({
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
    // min не правильно интерпретируется RHF
    // .min(1),
  })
  .refine((data) => data?.certificates && data?.certificates?.length > 0, {
    message: "Добавьте хотя бы одно удостоверение",
  })

/**
 * @deprecated Замена на отдельные формы
 */
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

  const onSubmitForm = useCallback(async (formData: any) => {
    toast.message("Сохранение и валидация в разработке...")
  }, [])

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
      {/* ПРОТОКОЛЫ */}
      <FieldDescription
        className={
          "flex w-full flex-row items-center justify-between gap-2 rounded-lg border bg-muted p-2 text-lg"
        }
      >
        {"Протоколы со списками удостоверений"}
        <Badge className={"border text-sm"} variant={"destructive"}>
          {form.watch("protocols")?.length ?? 0}
        </Badge>
      </FieldDescription>
      <GenericInnerList
        name={`protocols`}
        control={form.control}
        register={form.register}
        formState={form.formState}
        renderItems={(
          subFields,
          { append, remove, insert, getPath, errors }
        ) => (
          <div className={"w-full pl-6"}>
            {/* Ошибка самого массива (например, если пустой) */}
            {errors?.root && (
              <p style={{ color: "red" }}>{errors.root.message}</p>
            )}
            <Button
              className={"mb-2 w-fit"}
              variant={"outline"}
              type={"button"}
              onClick={() => {
                // Добавляем в начало списка
                insert(0, { date: new Date() })
              }}
            >
              <IconPlusFilled />
              {"Добавить"}
            </Button>
            {subFields.map((subField, subIndex) => {
              return (
                <div
                  key={subField.id}
                  className={
                    "mb-4 flex w-full flex-col items-start justify-center gap-2"
                  }
                >
                  <div
                    className={
                      "mb-2 flex flex-row items-center justify-start gap-2"
                    }
                  >
                    <div className={"text-xl font-bold"}>
                      {`Новый протокол`}
                    </div>
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() => remove(subIndex)}
                    >
                      <IconTrash className={"text-destructive"} />
                    </Button>
                  </div>
                  <div
                    className={
                      "grid w-full grid-cols-2 gap-2 rounded-lg border p-4"
                    }
                  >
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
                  </div>
                  {/* СПИСОК УДОСТОВЕРЕНИЙ */}
                  <FieldDescription
                    className={
                      "flex w-full flex-row items-center justify-between gap-2 rounded-lg border p-2 text-lg"
                    }
                  >
                    {"Список удостоверений протокола"}
                    <Badge className={"border text-sm"} variant={"destructive"}>
                      {form.watch(`protocols.${subIndex}.certificates`)
                        ?.length ?? 0}
                    </Badge>
                  </FieldDescription>
                  <GenericInnerList
                    name={`protocols.${subIndex}.certificates`}
                    control={form.control}
                    register={form.register}
                    formState={form.formState}
                    renderItems={(
                      subFields,
                      { append, remove, insert, getPath, errors }
                    ) => (
                      <div className={"w-full pl-6"}>
                        {/* Ошибка самого массива (например, если пустой) */}
                        {errors?.message && (
                          // <p style={{ color: "red" }}>{errors?.message}</p>
                          <Alert
                            className={"mt-2 mb-2"}
                            variant={"destructive"}
                          >
                            <IconAlertSquareRounded stroke={2} />
                            <AlertTitle>{errors?.message}</AlertTitle>
                          </Alert>
                        )}
                        <Button
                          className={"mb-2 w-fit"}
                          variant={"outline"}
                          type={"button"}
                          onClick={() => {
                            // Добавляем в начало списка
                            insert(0, { date: new Date() })
                          }}
                        >
                          <IconPlusFilled />
                          {"Добавить"}
                        </Button>
                        {subFields.map((subField, subIndex) => {
                          return (
                            <div
                              key={subField.id}
                              className={
                                "mb-4 flex w-full flex-col items-start justify-center gap-2"
                              }
                            >
                              <div
                                className={
                                  "mb-2 flex flex-row items-center justify-start gap-2"
                                }
                              >
                                <div className={"text-xl font-bold"}>
                                  {form.watch(
                                    getPath(subIndex, "certificateType")
                                  )?.id
                                    ? `${form.watch(getPath(subIndex, "certificateType.name"))}`
                                    : `Новое удостоверение`}
                                </div>
                                <Button
                                  size={"icon"}
                                  variant={"destructive"}
                                  onClick={() => remove(subIndex)}
                                >
                                  <IconTrash className={"text-destructive"} />
                                </Button>
                              </div>
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
                                {form.watch(
                                  getPath(subIndex, "certificateType")
                                )?.id &&
                                  form.watch(
                                    getPath(subIndex, "certificateType")
                                  )?.hasGroups && (
                                    <FieldInput
                                      required={true}
                                      form={form}
                                      path={getPath(subIndex, "group")}
                                      label={"Группа"}
                                      placeholder={"Укажите группу"}
                                    />
                                  )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  />
                  {/* КОНЕЦ СПИСКА УДОСТОВЕРЕНИЙ */}
                </div>
              )
            })}
          </div>
        )}
      />

      {/*УДОСТОВЕРЕНИЯ БЕЗ ПРОТОКОЛА*/}
      <FieldDescription
        className={
          "flex w-full flex-row items-center justify-between gap-2 rounded-lg border bg-muted p-2 text-lg"
        }
      >
        {"Удостоверения без протокола"}
        <Badge className={"border text-sm"} variant={"destructive"}>
          {form.watch("certificates")?.length ?? 0}
        </Badge>
      </FieldDescription>
      <GenericInnerList
        name={`certificates`}
        control={form.control}
        register={form.register}
        formState={form.formState}
        renderItems={(
          subFields,
          { append, remove, insert, getPath, errors }
        ) => (
          <div className={"w-full pl-6"}>
            {/* Ошибка самого массива (например, если пустой) */}
            {errors?.root && (
              <p style={{ color: "red" }}>{errors.root.message}</p>
            )}
            <Button
              className={"mb-2 w-fit"}
              variant={"outline"}
              type={"button"}
              onClick={() => {
                // Добавляем в начало списка
                insert(0, { date: new Date() })
              }}
            >
              <IconPlusFilled />
              {"Добавить"}
            </Button>
            {subFields.map((subField, subIndex) => {
              return (
                <div
                  key={subField.id}
                  className={
                    "mb-4 flex w-full flex-col items-start justify-center gap-2"
                  }
                >
                  <div
                    className={
                      "mb-2 flex flex-row items-center justify-start gap-2"
                    }
                  >
                    <div className={"text-xl font-bold"}>
                      {form.watch(getPath(subIndex, "certificateType"))?.id
                        ? `${form.watch(getPath(subIndex, "certificateType.name"))}`
                        : `Новое удостоверение`}
                    </div>
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() => remove(subIndex)}
                    >
                      <IconTrash className={"text-destructive"} />
                    </Button>
                  </div>
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
                </div>
              )
            })}
          </div>
        )}
      />

      <input type={"submit"} hidden ref={submitRef} />
    </form>
  )
})
