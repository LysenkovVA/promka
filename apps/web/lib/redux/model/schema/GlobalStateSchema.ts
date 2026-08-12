import { Action, Reducer, ReducersMapObject } from "redux"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { IAuthData } from "@/app/(auth)"
import { SimpleListReduxSchema } from "../types/SimpleListReduxSchema"
import { ICompanyEntity } from "@/app/(private)/(companies)"
import { IEmployeeEntity } from "@/app/(private)/(employees)"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>
  // Динамические
  companiesSimpleListSchema?: SimpleListReduxSchema<ICompanyEntity>
  companyDetailsSchema?: DetailsReduxSchema<ICompanyEntity>
  employeesSimpleListSchema?: SimpleListReduxSchema<IEmployeeEntity>
  employeeDetailsSchema?: DetailsReduxSchema<IEmployeeEntity>
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
