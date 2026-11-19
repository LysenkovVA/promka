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
  getSpecializationParameterDetailsData,
  getSpecializationParameterDetailsIsFetching,
  getSpecializationParameterDetailsIsInitialized,
} from "../../model/selectors/specialization-parameter-details.selectors"
import {
  SpecializationParameter,
  SpecializationParameterSchema,
} from "../../model/types/specialization-parameter.schema"
import { getSpecializationParameterByIdThunk } from "../../model/thunks/get-specialization-parameter-by-id.thunk"
import { createSpecializationParameterThunk } from "../../model/thunks/create-specialization-parameter.thunk"
import { updateSpecializationParameterThunk } from "../../model/thunks/update-specialization-parameter.thunk"
import { specializationParameterDetailsReducer } from "../../model/slice/specialization-parameter-details.slice"

export interface SpecializationParameterDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  specializationParameterId?: string
  onSubmit?: (data: SpecializationParameter) => void
}

export const SpecializationParameterDetailsForm = memo(
  (props: SpecializationParameterDetailsFormProps) => {
    const { onSubmit, submitRef, specializationParameterId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializationParameterDetailsData)
    const isInitialized = useAppSelector(
      getSpecializationParameterDetailsIsInitialized
    )
    const isLoading = useAppSelector(
      getSpecializationParameterDetailsIsFetching
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
      z.input<typeof SpecializationParameterSchema>,
      any,
      z.output<typeof SpecializationParameterSchema>
    >({
      resolver: zodResolver(SpecializationParameterSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (specializationParameterId && !isInitialized && !isLoading) {
        dispatch(
          getSpecializationParameterByIdThunk({
            specializationParameterId: specializationParameterId,
          })
        )
      }
    }, [dispatch, specializationParameterId, isInitialized, isLoading])

    useEffect(() => {
      methods.reset(data)
    }, [data, methods])

    const onSubmitForm = useCallback(
      async (formData: SpecializationParameter) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!specializationParameterId) {
              const result = await dispatch(
                createSpecializationParameterThunk({
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
                updateSpecializationParameterThunk({
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
      [auth?.activeWorkspace?.id, dispatch, specializationParameterId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{
          specializationParameterDetailsSchema:
            specializationParameterDetailsReducer,
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
