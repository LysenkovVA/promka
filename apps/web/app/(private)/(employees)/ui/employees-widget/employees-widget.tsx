"use client"

import { memo, useEffect } from "react"
import { InfoWidget } from "@/Workspaces/ui/InfoWidget/InfoWidget"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(public)/(auth)"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeesReducer } from "@/Employees/model/slice/employees.slice"
import { getEmployeesThunk } from "@/Employees/model/thunks/get-employees.thunk"
import {
  getEmployeesIsInitialized,
  getEmployeesIsLoading,
  getEmployeesTotalCount,
} from "@/Employees/model/selectors/employees.selectors"

export interface EmployeesWidgetProps {}

export const EmployeesWidget = memo((props: EmployeesWidgetProps) => {
  const {} = props

  const dispatch = useAppDispatch()

  const isInitialized = useAppSelector(getEmployeesIsInitialized)
  const isFetching = useAppSelector(getEmployeesIsLoading)
  const totalCount = useAppSelector(getEmployeesTotalCount)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized && !isFetching)
      dispatch(getEmployeesThunk({ replaceData: true }))
  }, [dispatch, isFetching, isInitialized])

  return (
    <DynamicModuleLoader
      reducers={{ employeesSchema: employeesReducer }}
      removeAfterUnmount={false}
    >
      <Link
        href={`/workspaces/${auth?.activeWorkspace?.id}/employees`}
        className={"w-full cursor-pointer"}
      >
        <InfoWidget
          title={"Сотрудники"}
          count={totalCount}
          onAddClick={() =>
            router.push(
              `/workspaces/${auth?.activeWorkspace?.id}/employees/create`
            )
          }
        />
      </Link>
    </DynamicModuleLoader>
  )
})
