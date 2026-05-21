import { AppStore, createReduxStore } from "./store"

// Временное замыкание для хранения store между HMR
let globalStore: AppStore | undefined = undefined

// Расширяем тип глобального объекта
declare global {
  var __REDUX_STORE__: AppStore | undefined
}

export const getStore = (): AppStore => {
  // На сервере — всегда новый store
  if (typeof window === "undefined") {
    return createReduxStore()
  }

  // 1. Попробуем взять из замыкания (надёжно при HMR)
  if (globalStore) {
    // console.log("🔁 Redux store использован из замыкания (HMR-safe)")
    return globalStore
  }

  // 2. Попробуем взять из глобального объекта
  if (!globalThis.__REDUX_STORE__) {
    // console.log("✅ Redux store создан")
    globalThis.__REDUX_STORE__ = createReduxStore()
  } else {
    // console.log("🔁 Redux store найден в globalThis")
  }

  // Сохраняем в замыкание на будущее
  globalStore = globalThis.__REDUX_STORE__
  return globalStore
}
