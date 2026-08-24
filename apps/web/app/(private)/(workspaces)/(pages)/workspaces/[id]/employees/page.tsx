"use client"

import { DynamicModuleLoader } from "@/lib/redux"
import { employeesSimpleListReducer } from "@/app/(private)/(employees)/model/slice/employees-simple-list-slice"
import { useEmployeesSimpleList } from "@/app/(private)/(employees)/hooks/useEmployeesSimpleList"
import { EmployeeCard } from "@/app/(private)/(employees)/ui/employee-card/employee-card"

export default function EmployeesPage() {
  const { data, isFetching } = useEmployeesSimpleList()

  return (
    <DynamicModuleLoader
      reducers={{ employeesSimpleListSchema: employeesSimpleListReducer }}
      removeAfterUnmount={false}
    >
      <div className={"mb-4 text-xl font-bold"}>Сотрудники</div>
      <div className="grid w-full grid-cols-3 gap-2 p-2 font-light">
        {data?.map((employee) => {
          return <EmployeeCard key={employee.id} employee={employee} />
        })}
      </div>
    </DynamicModuleLoader>
  )
}
