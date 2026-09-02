import { Action, Reducer, ReducersMapObject } from "redux"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { IAuthData } from "@/app/(public)/(auth)"
import { Workspace } from "@/Workspaces"
import { Employee } from "@/app/(private)/(employees)"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { EmployeeFilters } from "@/Employees/model/types/employee.filters"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>
  // Динамические
  workspaceDetailsSchema?: DetailsReduxSchema<Workspace>
  employeeDetailsSchema?: DetailsReduxSchema<Employee>
  employeesSchema?: ListReduxSchema<Employee, EmployeeFilters>
}

/**
 * Ключи глобальной схемы состояния
 */
export type GlobalStateSchemaKey = keyof GlobalStateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<GlobalStateSchema>
  reduce: (state: GlobalStateSchema | undefined, action: Action) => any
  add: (key: GlobalStateSchemaKey, reducer: Reducer) => void
  remove: (key: GlobalStateSchemaKey) => void
  resetState: () => void
}
