import { GlobalStateSchema, ReducerManager } from "./schema/GlobalStateSchema"
import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction,
} from "@reduxjs/toolkit"
import { createReducerManager } from "./reducerManager"
import { authReducer } from "@/app/(public)/(auth)/model/slice/authSlice"

/**
 * Центральное хранилище стейта.
 *
 * Внимание! Не использовать пустые интерфейсы, появляется ошибка при dispatch экшенов
 * @param initialState
 */
export const createReduxStore = (initialState?: GlobalStateSchema) => {
  const reducerManger = createReducerManager({
    // В корневой редюсер добавляются только те редюсеры,
    // которые являются обязательными
    authSchema: authReducer,
  })

  const store = configureStore<GlobalStateSchema>({
    // Корневой редюсер
    // Для прокидывания состояния из менеджера необходимо вызвать функцию reducerManger.reduce
    reducer: reducerManger.reduce,
    // Отладка только для разработки
    devTools: process.env.NODE_ENV !== "production",
    // Начальное состояние стейта
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Чтобы даты на форме не выдавали ошибок в консоль
      }),
  }) as ReduxStoreWithManager

  store.reducerManager = reducerManger

  // setupListeners(store.dispatch)

  // console.log("✅ Redux store создан!")

  return store
}

export interface ReduxStoreWithManager extends EnhancedStore<
  GlobalStateSchema,
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{
        dispatch: ThunkDispatch<GlobalStateSchema, undefined, UnknownAction>
      }>,
      StoreEnhancer,
    ]
  >
> {
  reducerManager: ReducerManager
}

// Infer the return type of `createReduxStore`
export type AppStore = ReturnType<typeof createReduxStore>
export type RootState = ReturnType<AppStore["getState"]>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]

export interface ThunkConfig<T> {
  rejectValue: T
  state: GlobalStateSchema
}
