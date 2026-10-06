"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import {
  getBerthTypeDetailsData,
  getBerthTypeDetailsIsFetching,
  getBerthTypeDetailsIsInitialized,
} from "../../model/selectors/berth-type-details.selectors"
import { BerthType, BerthTypeSchema } from "../../model/types/berth-type.schema"
import { getBerthTypeByIdThunk } from "../../model/thunks/get-berth-type-by-id.thunk"
import { createBerthTypeThunk } from "../../model/thunks/create-berth-type.thunk"
import { updateBerthTypeThunk } from "../../model/thunks/update-berth-type.thunk"
import { berthTypeDetailsReducer } from "../../model/slice/berth-type-details.slice"

export interface BerthTypeDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  berthTypeId?: string
  onSubmit?: (data: BerthType) => void
}

export const BerthTypeDetailsForm = memo((props: BerthTypeDetailsFormProps) => {
  const { onSubmit, submitRef, berthTypeId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthTypeDetailsData)
  const isInitialized = useAppSelector(getBerthTypeDetailsIsInitialized)
  const isLoading = useAppSelector(getBerthTypeDetailsIsFetching)

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
    z.input<typeof BerthTypeSchema>,
    any,
    z.output<typeof BerthTypeSchema>
  >({
    resolver: zodResolver(BerthTypeSchema),
    defaultValues: data,
  })

  useEffect(() => {
    if (berthTypeId && !isInitialized && !isLoading) {
      dispatch(getBerthTypeByIdThunk({ berthTypeId: berthTypeId }))
    }
  }, [dispatch, berthTypeId, isInitialized, isLoading])

  useEffect(() => {
    form.reset(data)
  }, [data, form])

  const onSubmitForm = useCallback(
    async (formData: BerthType) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        try {
          if (!berthTypeId) {
            const result = await dispatch(
              createBerthTypeThunk({
                entityData: formData,
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый тип должности добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateBerthTypeThunk({
                entityData: formData,
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
    [auth?.activeWorkspace?.id, dispatch, berthTypeId, onSubmit]
  )

  return (
    <DynamicModuleLoader
      reducers={{ berthTypeDetailsSchema: berthTypeDetailsReducer }}
      removeAfterUnmount={false}
    >
      <form
        id={"berth-type-details-form"}
        className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(onSubmitForm)(e)
        }}
      >
        <FieldGroup>
          <FieldInput
            required={true}
            form={form}
            path={"name"}
            label={"Название"}
            placeholder={"Укажите название типа должности"}
            description={'Например, "ИТР" или "Рабочий"'}
          />
        </FieldGroup>
        <input type={"submit"} hidden ref={submitRef} />
      </form>
    </DynamicModuleLoader>
  )
})
