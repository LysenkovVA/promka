import { Action, combineReducers, Reducer, ReducersMapObject } from "redux"
import {
  GlobalStateSchema,
  GlobalStateSchemaKey,
  ReducerManager,
} from "./schema/GlobalStateSchema"

export function createReducerManager(
  initialReducers: ReducersMapObject<GlobalStateSchema>
): ReducerManager {
  // Create an object which maps keys to reducers
  const reducers = { ...initialReducers }

  // Store the initial reducers for reset functionality
  const initialReducersMap = { ...initialReducers }

  // Create the initial combinedReducer
  let combinedReducer = combineReducers(reducers)

  // An array which is used to delete state keys when reducers are removed
  let keysToRemove: GlobalStateSchemaKey[] = []

  return {
    getReducerMap: () => reducers,

    // The root reducer function exposed by this object
    // This will be passed to the store
    reduce: (state: GlobalStateSchema | undefined, action: Action): any => {
      // Если какие-то редюсеры были удалены, убираем сперва их из состояния
      if (state && keysToRemove.length > 0) {
        state = { ...state }

        for (const key of keysToRemove) {
          // @ts-ignore
          delete state[key]
        }
        keysToRemove = []
      }

      // @ts-ignore
      return combinedReducer(state, action)
    },

    // Добавление редюсера по ключу
    add: (key: GlobalStateSchemaKey, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return
      }
      reducers[key] = reducer
      combinedReducer = combineReducers(reducers)
    },

    // Удаление редюсера по ключу
    remove: (key: GlobalStateSchemaKey) => {
      if (!key || !reducers[key]) {
        return
      }

      // @ts-ignore
      delete reducers[key]
      keysToRemove.push(key)
      combinedReducer = combineReducers(reducers)
    },
    // Сброс состояния редюсер-менеджера к начальному состоянию
    resetState: () => {
      // Находим ключи, которые нужно удалить (те, что не входят в начальные редюсеры)
      const currentKeys = Object.keys(reducers) as GlobalStateSchemaKey[]
      const initialKeys = Object.keys(
        initialReducersMap
      ) as GlobalStateSchemaKey[]

      // Добавляем в список на удаление все ключи, которых нет в начальных редюсерах
      const keysToRemoveOnReset = currentKeys.filter(
        (key) => !initialKeys.includes(key)
      )
      keysToRemove.push(...keysToRemoveOnReset)

      // Очищаем текущие редюсеры
      Object.keys(reducers).forEach((key) => {
        // @ts-ignore
        delete reducers[key as GlobalStateSchemaKey]
      })

      // Восстанавливаем начальные редюсеры
      Object.assign(reducers, initialReducersMap)

      // Пересоздаем комбинированный редюсер
      combinedReducer = combineReducers(reducers)
    },
  }
}
