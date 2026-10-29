"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { employeeDetailsReducer } from "../../../../../model/slice/employee-details.slice"
import { DetailsWrapper } from "@/components/details-wrapper/details-wrapper"
import { useRouter } from "next/navigation"
import { EmployeeDetailsForm } from "../../../../../ui/employee-details-form/employee-details-form"
import { useRef } from "react"

export default function CreateEmployeePage() {
  const router = useRouter()
  const hiddenSubmitInputRef = useRef<HTMLInputElement | null>(null)

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
        title={"Новый сотрудник"}
      >
        <EmployeeDetailsForm
          submitRef={hiddenSubmitInputRef}
          onSubmit={() => router.back()}
          employeeId={undefined}
        />
      </DetailsWrapper>
    </DynamicModuleLoader>
  )
}
