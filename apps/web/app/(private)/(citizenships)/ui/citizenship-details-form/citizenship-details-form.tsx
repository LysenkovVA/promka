"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
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
  getCitizenshipDetailsData,
  getCitizenshipDetailsIsFetching,
  getCitizenshipDetailsIsInitialized,
} from "../../model/selectors/citizenship-details.selectors"
import {
  Citizenship,
  CitizenshipSchema,
} from "../../model/types/citizenship.schema"
import { getCitizenshipByIdThunk } from "../../model/thunks/get-citizenship-by-id.thunk"
import { createCitizenshipThunk } from "../../model/thunks/create-citizenship.thunk"
import { updateCitizenshipThunk } from "../../model/thunks/update-citizenship.thunk"
import { citizenshipDetailsReducer } from "../../model/slice/citizenship-details.slice"

export interface CitizenshipDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  citizenshipId?: string
  onSubmit?: (data: Citizenship) => void
}

export const CitizenshipDetailsForm = memo(
  (props: CitizenshipDetailsFormProps) => {
    const { onSubmit, submitRef, citizenshipId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getCitizenshipDetailsData)
    const isInitialized = useAppSelector(getCitizenshipDetailsIsInitialized)
    const isLoading = useAppSelector(getCitizenshipDetailsIsFetching)

    /**
     * If your schema uses .default(...) on a field,
     * that field becomes optional on the schema's input type (z.input)
     * but stays required on its output type (z.output/z.infer) —
     * the default only fills it in after validation. Passing a single
     * generic to useForm<T> pins both to the same type and will conflict
     * with zodResolver, which infers input and output separately.
     * Either omit the generic and let it infer from resolver, or specify all three explicitly
     */
    const methods = useForm<
      z.input<typeof CitizenshipSchema>,
      any,
      z.output<typeof CitizenshipSchema>
    >({
      resolver: zodResolver(CitizenshipSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (citizenshipId && !isInitialized && !isLoading) {
        dispatch(getCitizenshipByIdThunk({ citizenshipId: citizenshipId }))
      }
    }, [dispatch, citizenshipId, isInitialized, isLoading])

    useEffect(() => {
      methods.reset(data)
    }, [data, methods])

    const onSubmitForm = useCallback(
      async (formData: Citizenship) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!citizenshipId) {
              const result = await dispatch(
                createCitizenshipThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новое гражданство добавлено", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateCitizenshipThunk({
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
      [auth?.activeWorkspace?.id, dispatch, citizenshipId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{ citizenshipDetailsSchema: citizenshipDetailsReducer }}
        removeAfterUnmount={false}
      >
        {/*Обязательно оборачиваем всю форму в FormProvider*/}
        <FormProvider {...methods}>
          <form
            id={"citizenship-details-form"}
            className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              methods.handleSubmit(onSubmitForm)(e)
            }}
          >
            <FieldGroup>
              <FieldInput
                required={true}
                name={"name"}
                label={"Название"}
                placeholder={"Укажите название"}
              />
            </FieldGroup>
            <input type={"submit"} hidden ref={submitRef} />
          </form>
        </FormProvider>
      </DynamicModuleLoader>
    )
  }
)
