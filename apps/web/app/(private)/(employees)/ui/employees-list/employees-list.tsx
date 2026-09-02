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

export const EmployeesList = memo(() => {
  const dispatch = useAppDispatch()

  const data = useAppSelector(getEmployees.selectAll)

  useEffect(() => {
    dispatch(getEmployeesThunk({ replaceData: true }))
  }, [])

  return (
    <DynamicModuleLoader
      reducers={{ employeesSchema: employeesReducer }}
      removeAfterUnmount={false}
    >
      {(!data || data.length === 0) && <div>Список сотрудников пуст</div>}
      {data && data.length > 0 && (
        <div className={"grid grid-cols-3 gap-3"}>
          {data.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </DynamicModuleLoader>
  )
})
