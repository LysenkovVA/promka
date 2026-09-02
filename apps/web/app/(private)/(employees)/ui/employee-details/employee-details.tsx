"use client"

import { memo, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeeDetailsReducer } from "@/Employees/model/slice/employee-details.slice"
import { Avatar } from "@workspace/ui/components/avatar"
import {
  getEmployeeDetailsData,
  getEmployeeDetailsError,
} from "@/Employees/model/selectors/employee-details.selectors"
import { getEmployeeByIdThunk } from "@/Employees/model/thunks/get-employee-by-id.thunk"

export interface EmployeeDetailsProps {
  employeeId?: string
}

export const EmployeeDetails = memo((props: EmployeeDetailsProps) => {
  const { employeeId } = props

  const dispatch = useAppDispatch()
  const data = useAppSelector(getEmployeeDetailsData)
  const error = useAppSelector(getEmployeeDetailsError)

  useEffect(() => {
    if (employeeId) dispatch(getEmployeeByIdThunk({ employeeId: employeeId }))
  }, [dispatch, employeeId])

  return (
    <DynamicModuleLoader
      reducers={{ employeeDetailsSchema: employeeDetailsReducer }}
      removeAfterUnmount={true}
    >
      <div className={"flex w-full flex-col items-start justify-start gap-3"}>
        {error && <div>{error}</div>}
        <div
          className={"flex w-full flex-row items-center justify-center gap-4"}
        >
          <Avatar style={{ width: 100, height: 100 }} />
          <div
            className={"flex w-full flex-col items-start justify-center gap-1"}
          >
            <div style={{ fontSize: 30, fontWeight: "bold" }}>
              {data?.surname}
            </div>
            <div style={{ fontSize: 20 }}>{data?.name}</div>
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  )
})
