import { Action, Reducer, ReducersMapObject } from "redux"
import { DetailsReduxSchema } from "@/lib/redux/model/types/DetailsReduxSchema"
import { IAuthData } from "@/app/(public)/(auth)"
import { SimpleListReduxSchema } from "../types/SimpleListReduxSchema"
import { IEmployeeEntity } from "@/app/(private)/(employees)"

/**
 * Схема глобального состояния
 */
export interface GlobalStateSchema {
  // Обязательные составляющие
  // Авторизация
  authSchema: DetailsReduxSchema<IAuthData>
  // Динамические
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
