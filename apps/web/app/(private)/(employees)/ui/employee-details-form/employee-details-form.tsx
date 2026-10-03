"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Employee, EmployeeSchema } from "../../model/types/employee.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"
import { useAppDispatch, useAppSelector } from "@/lib/redux"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "@/Employees/model/selectors/employee-details.selectors"
import { toast } from "sonner"
import { createEmployeeThunk } from "@/Employees/model/thunks/create-employee.thunk"
import { updateEmployeeThunk } from "@/Employees/model/thunks/update-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"

export interface EmployeeDetailsFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  employeeId?: string
  onSubmit?: (data: Employee) => void
}

export const EmployeeDetailsForm = memo((props: EmployeeDetailsFormProps) => {
  const { onSubmit, submitRef, employeeId } = props

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)
  const isLoading = useAppSelector(getEmployeeDetailsIsFetching)

  useEffect(() => {
    if (employeeId && !isInitialized && !isLoading) {
      dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
    }
  }, [dispatch, employeeId, isInitialized, isLoading])

  const onSubmitForm = useCallback(
    async (formData: Employee) => {
      if (formData) {
        if (!auth?.activeWorkspace?.id) {
          toast.error(JSON.stringify("Не удалось определить workspaceId"))
          return false
        }

        try {
          if (!employeeId) {
            const result = await dispatch(
              createEmployeeThunk({
                entityData: formData,
                workspaceId: auth.activeWorkspace.id,
              })
            ).unwrap()

            if (result.isOk) {
              toast.success("Новый сотрудник добавлен", {
                position: "top-center",
                style: {
                  color: "green",
                },
              })
              onSubmit?.(result.data!)
            }
          } else {
            const result = await dispatch(
              updateEmployeeThunk({
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
    [auth?.activeWorkspace?.id, dispatch, employeeId, onSubmit]
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
  const form = useForm<
    z.input<typeof EmployeeSchema>,
    any,
    z.output<typeof EmployeeSchema>
  >({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: data,
  })

  return (
    <form
      id={"berth-type-details-form"}
      className={"overflow-y no-scrollbar flex w-full flex-col gap-8 p-2"}
      onSubmit={form.handleSubmit(onSubmitForm)}
    >
      <FieldGroup>
        <FieldInput
          required={true}
          form={form}
          path={"surname"}
          label={"Фамилия"}
          placeholder={"Укажите фамилию"}
        />
      </FieldGroup>
      <input type={"submit"} hidden ref={submitRef} />
    </form>
  )
})
