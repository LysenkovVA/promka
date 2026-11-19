"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
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
import {
  getSpecializationDetailsData,
  getSpecializationDetailsIsFetching,
  getSpecializationDetailsIsInitialized,
} from "../../model/selectors/specialization-details.selectors"
import {
  Specialization,
  SpecializationSchema,
} from "../../model/types/specialization.schema"
import { getSpecializationByIdThunk } from "../../model/thunks/get-specialization-by-id.thunk"
import { createSpecializationThunk } from "../../model/thunks/create-specialization.thunk"
import { updateSpecializationThunk } from "../../model/thunks/update-specialization.thunk"
import { specializationDetailsReducer } from "../../model/slice/specialization-details.slice"
import { FieldDuration } from "../field-duration/field-duration"
import { FieldSpecializationDirection } from "@/SpecializationDirections"
import { FieldSwitch } from "@/components/form/field-switch/field-switch"
import { FieldSpecializationParameter } from "@/SpecializationParameters"
import { FieldInput } from "@/components/form/field-input/field-input"

export interface SpecializationDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  specializationId?: string
  onSubmit?: (data: Specialization) => void
}

export const SpecializationDetailsForm = memo(
  (props: SpecializationDetailsFormProps) => {
    const { onSubmit, submitRef, specializationId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getSpecializationDetailsData)
    const isInitialized = useAppSelector(getSpecializationDetailsIsInitialized)
    const isLoading = useAppSelector(getSpecializationDetailsIsFetching)

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
      z.input<typeof SpecializationSchema>,
      any,
      z.output<typeof SpecializationSchema>
    >({
      resolver: zodResolver(SpecializationSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (specializationId && !isInitialized && !isLoading) {
        dispatch(
          getSpecializationByIdThunk({ specializationId: specializationId })
        )
      }
    }, [dispatch, specializationId, isInitialized, isLoading])

    useEffect(() => {
      methods.reset(data)
    }, [data, methods])

    const onSubmitForm = useCallback(
      async (formData: Specialization) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!specializationId) {
              const result = await dispatch(
                createSpecializationThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новый тип удостоверения добавлен", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateSpecializationThunk({
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
      [auth?.activeWorkspace?.id, dispatch, specializationId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{
          specializationDetailsSchema: specializationDetailsReducer,
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
              <FieldSpecializationDirection
                control={methods.control}
                path={"specializationDirection"}
                label={"Название"}
              />
              <FieldSwitch
                control={methods.control}
                path={"hasParameter"}
                label={"Дополнительный параметр"}
                description={
                  "Выберите эту опцию, если требуется указать дополнительный параметр и его значение. Например, разряд 3"
                }
              />
              {methods.watch("hasParameter") && (
                <div className={"grid grid-cols-2 gap-2"}>
                  <FieldSpecializationParameter
                    form={methods}
                    path={"specializationParameter"}
                    label={"Параметр"}
                  />
                  <FieldInput
                    name={"specializationParameterValue"}
                    label={"Значение"}
                  />
                </div>
              )}
              <FieldDuration
                control={methods.control}
                path={"durationAtMonths"}
                label={"Срок действия"}
                description={"Укажите срок действия типа удостоверения"}
              />
            </FieldGroup>
            <FieldGroup>
              <FieldSwitch
                control={methods.control}
                path={"validAtOrganizationOnly"}
                label={"Действует внутри организации"}
                description={
                  "Выберите эту опцию, если обучение действует ТОЛЬКО внутри организации"
                }
              />
            </FieldGroup>
            <input type={"submit"} hidden ref={submitRef} />
          </form>
        </FormProvider>
      </DynamicModuleLoader>
    )
  }
)
