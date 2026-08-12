import { createEntityAdapter } from "@reduxjs/toolkit"
import { IEmployeeEntity } from "../types/IEmployeeEntity"

export const employeeAdapter = createEntityAdapter<IEmployeeEntity, string>({
  selectId: (entity) => entity.id!,
})
