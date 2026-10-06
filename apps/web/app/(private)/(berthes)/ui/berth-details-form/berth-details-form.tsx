"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { toast } from "sonner"
import { useAuth } from "@/app/(public)/(auth)"
import { Berth, BerthSchema } from "../../model/types/berth.schema"
import {
  getBerthDetailsData,
  getBerthDetailsIsFetching,
  getBerthDetailsIsInitialized,
} from "../../model/selectors/berth-details.selectors"
import { getBerthByIdThunk } from "../../model/thunks/get-berth-by-id.thunk"
import { createBerthThunk } from "../../model/thunks/create-berth.thunk"
import { updateBerthThunk } from "../../model/thunks/update-berth.thunk"
import { berthDetailsReducer } from "../../model/slice/berth-details.slice"
import { FieldBerthType } from "@/BerthTypes"
import { FieldTextArea } from "@/components/form/field-text-area/field-text-area"

export interface BerthDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  berthId?: string
  onSubmit?: (data: Berth) => void
}

export const BerthDetailsForm = memo((props: BerthDetailsFormProps) => {
  const { onSubmit, submitRef, berthId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getBerthDetailsData)
  const isInitialized = useAppSelector(getBerthDetailsIsInitialized)
  const isLoading = useAppSelector(getBerthDetailsIsFetching)

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
    z.input<typeof BerthSchema>,
    any,
    z.output<typeof BerthSchema>
  >({
    resolver: zodResolver(BerthSchema),
    defaultValues: data,
  })

  useEffect(() => {
    if (berthId && !isInitialized && !isLoading) {
      dispatch(getBerthByIdThunk({ berthId: berthId }))
    }
  }, [dispatch, berthId, isInitialized, isLoading])

  useEffect(() => {
    form.reset(data)
  }, [data, form])

  const onSubmitForm = useCallback(
    async (formData: Berth) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        try {
          if (!berthId) {
            const result = await dispatch(
              createBerthThunk({
                entityData: formData,
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новая должность добавлена", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateBerthThunk({
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
    [auth?.activeWorkspace?.id, dispatch, berthId, onSubmit]
  )

  return (
    <DynamicModuleLoader
      reducers={{ berthDetailsSchema: berthDetailsReducer }}
      removeAfterUnmount={false}
    >
      <form
        id={"berth-details-form"}
        className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit(onSubmitForm)(e)
        }}
      >
        <FieldGroup>
          <FieldBerthType
            form={form}
            path={"berthType"}
            label={"Тип должности"}
            required={true}
          />
          <FieldTextArea
            required={true}
            form={form}
            path={"name"}
            label={"Название"}
            placeholder={"Укажите название должности"}
          />
        </FieldGroup>
        <input type={"submit"} hidden ref={submitRef} />
      </form>
    </DynamicModuleLoader>
  )
})
