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
import { employeesStatisticsReducer } from "../../model/slice/employees-statistics.slice"
import {
  getEmployeeStatisticsData,
  getEmployeeStatisticsError,
  getEmployeeStatisticsIsFetching,
  getEmployeeStatisticsIsInitialized,
} from "../../model/selectors/employees-statistics.selectors"
import { getEmployeesStatisticsThunk } from "../../model/thunks/get-employees-statistics.thunk"

export interface EmployeesWidgetProps {}

export const EmployeesWidget = memo((props: EmployeesWidgetProps) => {
  const {} = props

  const dispatch = useAppDispatch()

  const isInitialized = useAppSelector(getEmployeeStatisticsIsInitialized)
  const isFetching = useAppSelector(getEmployeeStatisticsIsFetching)
  const data = useAppSelector(getEmployeeStatisticsData)
  const error = useAppSelector(getEmployeeStatisticsError)

  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized && !isFetching && auth?.activeWorkspace?.id)
      dispatch(getEmployeesStatisticsThunk({ replaceData: true }))
  }, [dispatch, isFetching, isInitialized, auth?.activeWorkspace?.id])

  return (
    <DynamicModuleLoader
      reducers={{ employeesStatisticsSchema: employeesStatisticsReducer }}
      removeAfterUnmount={false}
    >
      <Link
        href={`/workspaces/${auth?.activeWorkspace?.id}/employees`}
        className={"w-full cursor-pointer"}
      >
        <InfoWidget
          title={"Сотрудники"}
          count={data?.count ?? 0}
          error={error}
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
