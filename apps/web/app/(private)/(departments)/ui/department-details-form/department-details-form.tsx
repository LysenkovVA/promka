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
  getDepartmentDetailsData,
  getDepartmentDetailsIsFetching,
  getDepartmentDetailsIsInitialized,
} from "../../model/selectors/department-details.selectors"
import {
  Department,
  DepartmentSchema,
} from "../../model/types/department.schema"
import { getDepartmentByIdThunk } from "../../model/thunks/get-department-by-id.thunk"
import { createDepartmentThunk } from "../../model/thunks/create-department.thunk"
import { updateDepartmentThunk } from "../../model/thunks/update-department.thunk"
import { departmentDetailsReducer } from "../../model/slice/department-details.slice"

export interface DepartmentDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  departmentId?: string
  onSubmit?: (data: Department) => void
}

export const DepartmentDetailsForm = memo(
  (props: DepartmentDetailsFormProps) => {
    const { onSubmit, submitRef, departmentId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getDepartmentDetailsData)
    const isInitialized = useAppSelector(getDepartmentDetailsIsInitialized)
    const isLoading = useAppSelector(getDepartmentDetailsIsFetching)

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
      z.input<typeof DepartmentSchema>,
      any,
      z.output<typeof DepartmentSchema>
    >({
      resolver: zodResolver(DepartmentSchema),
      defaultValues: data,
    })

    useEffect(() => {
      if (departmentId && !isInitialized && !isLoading) {
        dispatch(getDepartmentByIdThunk({ departmentId: departmentId }))
      }
    }, [dispatch, departmentId, isInitialized, isLoading])

    useEffect(() => {
      form.reset(data)
    }, [data, form])

    const onSubmitForm = useCallback(
      async (formData: Department) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          try {
            if (!departmentId) {
              const result = await dispatch(
                createDepartmentThunk({
                  entityData: formData,
                  workspaceId: auth.activeWorkspace.id,
                })
              ).unwrap()

              if (result.isOk) {
                toast.success("Новое подразделение добавлено", {
                  position: "top-center",
                  style: {
                    color: "green",
                  },
                })
                onSubmit?.(result.data!)
              }
            } else {
              const result = await dispatch(
                updateDepartmentThunk({
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
      [auth?.activeWorkspace?.id, dispatch, departmentId, onSubmit]
    )

    return (
      <DynamicModuleLoader
        reducers={{ departmentDetailsSchema: departmentDetailsReducer }}
        removeAfterUnmount={false}
      >
        <form
          id={"department-details-form"}
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
              placeholder={"Укажите название подразделения"}
            />
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </DynamicModuleLoader>
    )
  }
)
