"use client"

import { memo, useEffect } from "react"
import {
  DynamicModuleLoader,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux"
import { employeesReducer } from "../../model/slice/employees.slice"
import { getEmployees } from "../../model/selectors/employees.selectors"
import { EmployeeCard } from "../employee-card/employee-card"
import { getEmployeesThunk } from "../../model/thunks/get-employees.thunk"
import { useAuth } from "@/app/(public)/(auth)"
import { PageWrapper } from "@/components/page-wrapper/page-wrapper"
import { Button } from "@workspace/ui/components/button"
import { IconPlusFilled } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export const EmployeesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployees.selectAll)
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    dispatch(getEmployeesThunk({ replaceData: true }))
  }, [])

  return (
    <DynamicModuleLoader
      reducers={{ employeesSchema: employeesReducer }}
      removeAfterUnmount={false}
    >
      <PageWrapper>
        <div className={"flex w-full items-center justify-between pb-4"}>
          <div className={"text-2xl font-light"}>
            {`Сотрудники ${auth.activeWorkspace?.company?.name}`}
          </div>
          <Button
            onClick={() =>
              router.push(
                `/workspaces/${auth?.activeWorkspace?.id}/employees/create`
              )
            }
          >
            <IconPlusFilled />
            {"Добавить"}
          </Button>
        </div>
        {(!data || data?.length === 0) && <div>Список сотрудников пуст</div>}
        {data && data.length > 0 && (
          <div className={"grid grid-cols-3 gap-3"}>
            {data.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </PageWrapper>
    </DynamicModuleLoader>
  )
})
