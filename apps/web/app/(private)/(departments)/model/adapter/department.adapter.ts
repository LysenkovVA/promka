import { createEntityAdapter } from "@reduxjs/toolkit"
import { Department } from "../types/department.schema"

export const departmentAdapter = createEntityAdapter<Department, string>({
  selectId: (entity) => entity.id!,
})
