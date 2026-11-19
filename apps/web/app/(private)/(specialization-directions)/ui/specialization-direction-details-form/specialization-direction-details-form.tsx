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
  getSpecializationDirectionDetailsData,
  getSpecializationDirectionDetailsIsFetching,
  getSpecializationDirectionDetailsIsInitialized,
} from "../../model/selectors/specialization-direction-details.selectors"
import {
  SpecializationDirection,
  SpecializationDirectionSchema,
} from "../../model/types/specialization-direction.schema"
import { getSpecializationDirectionByIdThunk } from "../../model/thunks/get-specialization-direction-by-id.thunk"
import { createSpecializationDirectionThunk } from "../../model/thunks/create-specialization-direction.thunk"
import { updateSpecializationDirectionThunk } from "../../model/thunks/update-specialization-direction.thunk"
import { specializationDirectionDetailsReducer } from "../../model/slice/specialization-direction-details.slice"

export interface SpecializationDirectionDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  specializationDirectionId?: string
  onSubmit?: (data: SpecializationDirection) => void
}

export const SpecializationDirectionDetailsForm = memo(
  (props: SpecializationDirectionDetailsFormProps) => {
    const { onSubmit, submitRef, specializationDirectionId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializationDirectionDetailsData)
    const isInitialized = useAppSelector(
      getSpecializationDirectionDetailsIsInitialized
    )
    const isLoading = useAppSelector(
      getSpecializationDirectionDetailsIsFetching
    )

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
      z.input<typeof SpecializationDirectionSchema>,
      any,
      z.output<typeof SpecializationDirectionSchema>
    >({
      resolver: zodResolver(SpecializationDirectionSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (specializationDirectionId && !isInitialized && !isLoading) {
        dispatch(
          getSpecializationDirectionByIdThunk({
            specializationDirectionId: specializationDirectionId,
          })
        )
      }
    }, [dispatch, specializationDirectionId, isInitialized, isLoading])

    useEffect(() => {
      methods.reset(data)
    }, [data, methods])

    const onSubmitForm = useCallback(
      async (formData: SpecializationDirection) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!specializationDirectionId) {
              const result = await dispatch(
                createSpecializationDirectionThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новый параметр типа удостоверения добавлен", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateSpecializationDirectionThunk({
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
      [auth?.activeWorkspace?.id, dispatch, specializationDirectionId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{
          specializationDirectionDetailsSchema:
            specializationDirectionDetailsReducer,
        }}
        removeAfterUnmount={false}
      >
        {/*Обязательно оборачиваем всю форму в FormProvider*/}
        <FormProvider {...methods}>
          <form
            id={"certificate-type-details-form"}
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
                placeholder={"Укажите название параметра"}
              />
            </FieldGroup>
            <input type={"submit"} hidden ref={submitRef} />
          </form>
        </FormProvider>
      </DynamicModuleLoader>
    )
  }
)
