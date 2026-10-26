"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Protocol } from "../../model/types/protocol.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { getProtocolByIdThunk } from "@/Protocols/model/thunks/get-protocol-by-id.thunk"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  getProtocolDetailsData,
  getProtocolDetailsIsFetching,
  getProtocolDetailsIsInitialized,
} from "../../model/selectors/protocol-details.selectors"
import { toast } from "sonner"
import { createProtocolThunk } from "../../model/thunks/create-protocol.thunk"
import { updateProtocolThunk } from "../../model/thunks/update-protocol.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { protocolDetailsReducer } from "../../model/slice/protocol-details.slice"
import { FieldDatePicker } from "@/components/form/field-date-picker/field-date-picker"
import { FormFieldError } from "@/components/form/form-field-error/form-field-error"
import { GenericInnerList } from "@/components/form/form-generic-inner-list/form-generic-inner-list"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled, IconTrash } from "@tabler/icons-react"
import { FieldEmployee } from "@/Employees"
import { FieldCertificateType } from "@/CertificateTypes"
import { ProtocolRequestSchema } from "@/Protocols/model/types/protocol-request.schema"

export interface ProtocolDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  protocolId?: string
  onSubmit?: (data: Protocol) => void
}

export const ProtocolDetailsForm = memo((props: ProtocolDetailsFormProps) => {
  const { onSubmit, submitRef, protocolId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getProtocolDetailsData)
  const isInitialized = useAppSelector(getProtocolDetailsIsInitialized)
  const isLoading = useAppSelector(getProtocolDetailsIsFetching)

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
    z.input<typeof ProtocolRequestSchema>,
    any,
    z.output<typeof ProtocolRequestSchema>
  >({
    resolver: zodResolver(ProtocolRequestSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (protocolId && !isInitialized && !isLoading) {
      dispatch(getProtocolByIdThunk({ protocolId: protocolId }))
    }
  }, [dispatch, protocolId, isInitialized, isLoading])

  useEffect(() => {
    form.reset(data)
  }, [data, form])

  const onSubmitForm = useCallback(
    async (formData: Protocol) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        try {
          if (!protocolId) {
            const result = await dispatch(
              createProtocolThunk({
                entityData: { ...formData },
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый протокол добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateProtocolThunk({
                entityData: { ...formData },
                workspaceId: auth?.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Изменения сохранены", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          }
        } catch (error) {
          toast.error((error as string) ?? "Ошибка", {
            position: "top-center",
            style: { color: "tomato" },
          })
        }
      }
    },
    [auth?.activeWorkspace?.id, dispatch, protocolId, onSubmit]
  )

  return (
    <DynamicModuleLoader
      reducers={{ protocolDetailsSchema: protocolDetailsReducer }}
      removeAfterUnmount={false}
    >
      <form
        id={"protocol-details-form"}
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
        <FieldGroup>
          <div className={"grid grid-cols-2 gap-2"}>
            <FieldInput
              required={true}
              form={form}
              path={"number"}
              label={"Номер"}
              placeholder={"Укажите номер"}
            />
            <FieldDatePicker form={form} path={"date"} label={"Дата"} />
          </div>
        </FieldGroup>
        {form.formState.errors.certificates?.message && (
          <FormFieldError
            message={form.formState.errors.certificates.message}
            withBorder
          />
        )}
        <GenericInnerList
          name={"certificates"}
          // @ts-ignore
          control={form.control}
          register={form.register}
          formState={form.formState}
          renderItems={(
            subFields,
            { append, remove, insert, getPath, errors }
          ) => (
            <div className={"w-full pl-6"}>
              <Button
                className={"mb-2 w-fit"}
                variant={"outline"}
                type={"button"}
                onClick={() => {
                  // Добавляем в начало списка
                  append({
                    certificateType: undefined,
                    employee: undefined,
                    number: "",
                    date: new Date(),
                    group: undefined,
                  })
                }}
              >
                <IconPlusFilled />
                {"Добавить"}
              </Button>
              {subFields.map((subField, subIndex) => {
                return (
                  <div
                    key={subIndex}
                    className={
                      "mb-4 flex w-full flex-col items-start justify-center gap-2"
                    }
                  >
                    <div
                      className={
                        "mb-2 flex flex-row items-center justify-start gap-2"
                      }
                    >
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
                      {/*{form.watch(getPath(subIndex, "certificateType"))?.id &&*/}
                      {/*  form.watch(getPath(subIndex, "certificateType"))*/}
                      {/*    ?.hasGroups && (*/}
                      {/*    <FieldInput*/}
                      {/*      required={true}*/}
                      {/*      form={form}*/}
                      {/*      path={getPath(subIndex, "group")}*/}
                      {/*      label={"Группа"}*/}
                      {/*      placeholder={"Укажите группу"}*/}
                      {/*    />*/}
                      {/*  )}*/}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        />
        <input type={"submit"} hidden ref={submitRef} />
      </form>
    </DynamicModuleLoader>
  )
})
