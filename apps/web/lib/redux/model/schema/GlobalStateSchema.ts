import { Action, Reducer, ReducersMapObject } from "redux"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { IAuthData } from "@/app/(public)/(auth)"
import { Workspace } from "@/Workspaces"
import { ListReduxSchema } from "@/lib/redux/model/types/ListReduxSchema"
import { Berth, BerthFilters } from "@/Berthes"
import { Employee, EmployeeFilters } from "@/Employees"
import { BerthType } from "@/BerthTypes"
import { BerthTypesFilters } from "@/BerthTypes/model/types/berth-type.filters"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>
  // Динамические
  workspaceDetailsSchema?: DetailsReduxSchema<Workspace>
  // Сотрудники
  employeeDetailsSchema?: DetailsReduxSchema<Employee>
  employeesSchema?: ListReduxSchema<Employee, EmployeeFilters>
  // Должности
  berthDetailsSchema?: DetailsReduxSchema<Berth>
  berthesSchema?: ListReduxSchema<Berth, BerthFilters>
  // Типы должностей
  berthTypeDetailsSchema?: DetailsReduxSchema<BerthType>
  berthTypesSchema?: ListReduxSchema<BerthType, BerthTypesFilters>
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
