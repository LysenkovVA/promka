"use client"

import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeeDetailsReducer } from "@/Employees/model/slice/employee-details.slice"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { EmployeeDetailsForm } from "@/Employees/ui/employee-details-form/employee-details-form"
import { useCallback } from "react"
import { toast } from "sonner"
import { createEmployeeThunk } from "@/Employees/model/thunks/create-employee.thunk"
import { getEmployeeDetailsFormData } from "@/Employees/model/selectors/employee-details.selectors"
import { useAuth } from "@/app/(public)/(auth)"

export default function CreateEmployeePage() {
  const router = useRouter()

  const auth = useAuth()

  const dispatch = useAppDispatch()
  const formData = useAppSelector(getEmployeeDetailsFormData)

  const onSubmit = useCallback(async () => {
    if (formData) {
      if (!auth?.activeWorkspace?.id) {
        toast.error(JSON.stringify("Не удалось определить workspaceId"))
        return false
      }

      try {
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

          router.back()
        }
      } catch (error) {
        toast.error((error as string) ?? "Ошибка", {
          position: "top-center",
          style: { color: "tomato" },
        })
      }
    }
  }, [auth.activeWorkspace?.id, dispatch, formData, router])

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        isEdit={true}
        onBackClick={() => router.back()}
        onSaveClick={onSubmit}
      >
        <EmployeeDetailsForm />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
