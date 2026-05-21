"use client"
import { useAppDispatch, useAppStore } from "../../model/hooks/hooks"
import { ReactNode, useEffect } from "react"
import {
  GlobalStateSchema,
  GlobalStateSchemaKey,
} from "../../model/schema/GlobalStateSchema"
import { Reducer } from "redux"

export type ReducersList = {
  [name in GlobalStateSchemaKey]?: Reducer<NonNullable<GlobalStateSchema[name]>> // по ключу получаем нужный редюсер
}

interface DynamicModuleLoaderProps {
  reducers: {
    [name in keyof GlobalStateSchema]?: Reducer<
      NonNullable<GlobalStateSchema[name]>
    >
  }
  removeAfterUnmount?: boolean
  children: ReactNode
}

export const DynamicModuleLoader = (props: DynamicModuleLoaderProps) => {
  const { children, reducers, removeAfterUnmount = true } = props

  const store = useAppStore()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const mountedReducers = store.reducerManager.getReducerMap()

    Object.entries(reducers).forEach(([name, reducer]) => {
      const mounted = mountedReducers[name as GlobalStateSchemaKey]
      // Добавляем новый редюсер только если его нет
      if (!mounted) {
        store.reducerManager.add(name as GlobalStateSchemaKey, reducer)
        dispatch({ type: `@INIT ${name} reducer` })
      }
    })

    return () => {
      if (removeAfterUnmount) {
        Object.entries(reducers).forEach(([name, reducer]) => {
          store.reducerManager.remove(name as GlobalStateSchemaKey)
          dispatch({ type: `@DESTROY ${name} reducer` })
        })
      }
    }
    // eslint-disable-next-line
  }, [])

  return <>{children}</>
}
