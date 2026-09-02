import { createEntityAdapter } from "@reduxjs/toolkit"
import { Employee } from "../types/employee.schema"

export const employeeAdapter = createEntityAdapter<Employee, string>({
  selectId: (entity) => entity.id!,
})
