"use client"

import { ReactNode } from "react"
import { Provider } from "react-redux"
import { getStore } from "@/lib/redux/model/storeInstance"

export interface StoreProviderProps {
  children?: ReactNode
}

export const StoreProvider = (props: StoreProviderProps) => {
  // // Ссылка хранит экземпляр стора, исключая его повторное создание при ререндерах
  // const storeRef = useRef<AppStore | null>(null)
  //
  // if (!storeRef.current) {
  //   // Создаем стор впервые — это произойдет один раз на клиенте
  //   storeRef.current = createReduxStore()
  // }

  // return <Provider store={storeRef.current}>{props.children}</Provider>
  return <Provider store={getStore()}>{props.children}</Provider>
}

export default StoreProvider
