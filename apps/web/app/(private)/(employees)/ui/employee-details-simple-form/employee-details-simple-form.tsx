"use client"

import { memo, RefObject, useCallback, useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Employee, EmployeeSchema } from "../../model/types/employee.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldInput } from "@/components/form/field-input/field-input"
import { FieldGroup } from "@workspace/ui/components/field"
import { z } from "zod/v4"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsIsFetching,
  getEmployeeDetailsIsInitialized,
} from "../../model/selectors/employee-details.selectors"
import { toast } from "sonner"
import { createEmployeeThunk } from "../../model/thunks/create-employee.thunk"
import { updateEmployeeThunk } from "../../model/thunks/update-employee.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { employeeDetailsReducer } from "../../model/slice/employee-details.slice"

export interface EmployeeDetailsSimpleFormProps {
  submitRef: RefObject<HTMLInputElement | null>
  employeeId?: string
  onSubmit?: (data: Employee) => void
}

export const EmployeeDetailsSimpleForm = memo(
  (props: EmployeeDetailsSimpleFormProps) => {
    const { onSubmit, submitRef, employeeId } = props

    const auth = useAuth()

    const dispatch = useAppDispatch()
    const data = useAppSelector(getEmployeeDetailsData)
    const isInitialized = useAppSelector(getEmployeeDetailsIsInitialized)
    const isLoading = useAppSelector(getEmployeeDetailsIsFetching)

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

    // Работа со списком удостоверений
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "certificates",
    })

    useEffect(() => {
      if (employeeId && !isInitialized && !isLoading) {
        dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
      }
    }, [dispatch, employeeId, isInitialized, isLoading])

    useEffect(() => {
      form.reset(data)
    }, [data, form])

    const onSubmitForm = useCallback(
      async (formData: Employee) => {
        if (formData) {
          if (!auth?.activeWorkspace?.id) {
            toast.error(JSON.stringify("Не удалось определить workspaceId"))
            return false
          }

          // Отправляем на бэкэнд чистые цифры или строку с маской
          const rawDigits = formData?.snils?.replace(/\D/g, "")

          try {
            if (!employeeId) {
              const result = await dispatch(
                createEmployeeThunk({
                  entityData: { ...formData, snils: rawDigits },
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
                  entityData: { ...formData, snils: rawDigits },
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

    return (
      <DynamicModuleLoader
        reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
        removeAfterUnmount={false}
      >
        <form
          id={"employee-details-simple-form"}
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
              path={"surname"}
              label={"Фамилия"}
              placeholder={"Укажите фамилию"}
            />
            <div className={"grid grid-cols-2 gap-2"}>
              <FieldInput
                form={form}
                path={"name"}
                label={"Имя"}
                placeholder={"Укажите имя"}
              />
              <FieldInput
                form={form}
                path={"patronymic"}
                label={"Отчество"}
                placeholder={"Укажите отчество"}
              />
            </div>
          </FieldGroup>
          <input type={"submit"} hidden ref={submitRef} />
        </form>
      </DynamicModuleLoader>
    )
  }
)
