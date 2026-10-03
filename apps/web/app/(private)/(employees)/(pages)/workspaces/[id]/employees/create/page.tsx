"use client"

import { DynamicModuleLoader, useAppDispatch } from "@/lib/redux"
import { employeeDetailsReducer } from "@/Employees/model/slice/employee-details.slice"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { EmployeeDetailsForm } from "@/Employees/ui/employee-details-form/employee-details-form"
import { useRef } from "react"
import { useAuth } from "@/app/(public)/(auth)"

export default function CreateEmployeePage() {
  const router = useRouter()
  const auth = useAuth()
  const dispatch = useAppDispatch()

  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

  // const onSubmit = useCallback(
  //   async (formData: Employee) => {
  //     if (formData) {
  //       if (!auth?.activeWorkspace?.id) {
  //         toast.error(JSON.stringify("Не удалось определить workspaceId"))
  //         return false
  //       }
  //
  //       try {
  //         const result = await dispatch(
  //           createEmployeeThunk({
  //             entityData: formData,
  //             workspaceId: auth.activeWorkspace.id,
  //           })
  //         ).unwrap()
  //
  //         if (result.isOk) {
  //           toast.success("Новый сотрудник добавлен", {
  //             position: "top-center",
  //             style: {
  //               color: "green",
  //             },
  //           })
  //
  //           router.back()
  //         }
  //       } catch (error) {
  //         toast.error((error as string) ?? "Ошибка", {
  //           position: "top-center",
  //           style: { color: "tomato" },
  //         })
  //       }
  //     }
  //   },
  //   [auth?.activeWorkspace?.id, dispatch, router]
  // )

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <DetailsWrapper
        isEdit={true}
        onBackClick={() => router.back()}
        onSaveClick={() => {
          hiddenSubmitInputRef.current?.click()
        }}
      >
        <EmployeeDetailsForm
          onSubmit={() => router.back()}
          submitRef={hiddenSubmitInputRef}
        />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
